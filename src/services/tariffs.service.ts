import env from "#config/env/env.js";
import knex from "#postgres/knex.js";
import { ServiceError } from "#errors/Service.error.js";
import {ServerTemporarilyUnavailableError} from "#errors/ServiceTemporarilyUnavailable.error.js";
import { IWbApiResponse } from "#interfaces/responses.interface.js";
import { ITariffBatch, IBoxTariff } from "#interfaces/tariff.interface.js";
import { TariffsRepository } from "#repositories/tariffs.repository.js";
import { getToday } from "#helpers/getToday.js";
import { stringAsNumberValuePipe } from "#helpers/pipes.js";

export class TariffsService {
    private WB_TARIFF_API_URL = env.WB_TARIFF_API_URL;
    private WB_API_BEARER_TOKEN = env.WB_API_BEARER_TOKEN;

    constructor(private readonly tariffsRepository: TariffsRepository) {}

    async syncTariffs(): Promise<void> {
        const todayDate = getToday();

        const apiData = await this.fetchWbApi({ date: todayDate });
        const tariffsData: ITariffBatch = {
            date: todayDate,
            dt_next_box: apiData.response.data.dtNextBox,
            dt_till_max: apiData.response.data.dtTillMax,
            warehouse_list: apiData.response.data.warehouseList.map(w => ({
                box_delivery_base: w.boxDeliveryBase,
                box_delivery_coef_expr: w.boxDeliveryCoefExpr,
                box_delivery_liter: w.boxDeliveryLiter,
                box_delivery_marketplace_base: w.boxDeliveryMarketplaceBase,
                box_delivery_marketplace_coef_expr: w.boxDeliveryMarketplaceCoefExpr,
                box_delivery_marketplace_liter: w.boxDeliveryMarketplaceLiter,
                box_storage_base: w.boxStorageBase,
                box_storage_coef_expr: w.boxStorageCoefExpr,
                box_storage_liter: w.boxStorageLiter,
                geo_name: w.geoName,
                warehouse_name: w.warehouseName
            }))
        };

        await knex.transaction(async trx => {
            let tariffsBatch = await this.tariffsRepository.findBatchByDate(todayDate, trx);

            if (!tariffsBatch) {
                // tariff by date doesn't exist => create batch
                tariffsBatch = await this.tariffsRepository.insertBatch({
                    dt_next_box: tariffsData.dt_next_box,
                    dt_till_max: tariffsData.dt_till_max,
                    date: todayDate,
                }, trx);
            }

            // clear tariffs batch warehouse
            await this.tariffsRepository.deleteBoxTariffs(tariffsBatch.id, trx);

            // insert tariff warehouses
            const rows: IBoxTariff[] = tariffsData.warehouse_list.map(tariff => ({
                box_delivery_base: stringAsNumberValuePipe(tariff.box_delivery_base),
                box_delivery_coef_expr: stringAsNumberValuePipe(tariff.box_delivery_coef_expr),
                box_delivery_liter: stringAsNumberValuePipe(tariff.box_delivery_liter),
                box_delivery_marketplace_base: stringAsNumberValuePipe(tariff.box_delivery_marketplace_base),
                box_delivery_marketplace_coef_expr: stringAsNumberValuePipe(tariff.box_delivery_marketplace_coef_expr),
                box_delivery_marketplace_liter: stringAsNumberValuePipe(tariff.box_delivery_marketplace_liter),
                box_storage_base: stringAsNumberValuePipe(tariff.box_storage_base),
                box_storage_coef_expr: stringAsNumberValuePipe(tariff.box_storage_coef_expr),
                box_storage_liter: stringAsNumberValuePipe(tariff.box_storage_liter),
                geo_name: tariff.geo_name,
                warehouse_name: tariff.warehouse_name,
                batch_id: tariffsBatch.id 
            }));

            await trx('box_tariffs').insert(rows);
        });
    }

    async fetchWbApi(reqParams: Record<string, string>): Promise<IWbApiResponse> {
        console.log('WB API URL: ' + this.WB_TARIFF_API_URL);
        const url = `${this.WB_TARIFF_API_URL}?${new URLSearchParams(reqParams)}`;
        const props: RequestInit = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.WB_API_BEARER_TOKEN}`,
                "Content-Type": "application/json"
            }
        };
        console.log('REQUEST TO URL: ' + url);

        const response = await fetch(url, props);
        this.handleWbApiErrors(response);

        const data: IWbApiResponse = await response.json();
        console.log("[WB API] Response:", data);

        return data;
    }

    private async handleWbApiErrors(response: Response): Promise<void> {
        if (response.status === 503) {
            throw new ServerTemporarilyUnavailableError({
                code: "service_temporarily_unavailable",
                text: "Something went wrong and WB API is not responding",
            });
        }

        if (!response.ok) {
            throw new ServiceError({
                code: "external_api_error",
                text: `External API error (status ${response.status})`,
                data: { status: response.status, url: response.url },
            });
        }
    }
}
