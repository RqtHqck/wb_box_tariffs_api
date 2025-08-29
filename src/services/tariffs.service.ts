import env from "#config/env/env.js";
import { ServiceError } from "#errors/Service.error.js";
import ServerTemporarilyUnavailableError from "#errors/ServiceTemporarilyUnavailable.error.js";
import { IWbApiResponse } from "#interfaces/responses.interface.js";
import { handleError } from "#utils/errorHandler.js";
import knex from "#postgres/knex.js";
import { ITariffBatch } from "#interfaces/tariff.interface.js";
import { TariffsRepository } from "#repository/tariffs.repository.js";

export class TariffsService {
    private WB_TARIFF_API_URL = env.WB_TARIFF_API_URL
    private WB_API_BEARER_TOKEN = env.WB_API_BEARER_TOKEN

    constructor(private readonly tariffsRepository: TariffsRepository) {}

    async syncTariffs(): Promise<void> {
        try {

            const todayDate = this.getToday();

            const apiData = await this.fetchWbApi({ date: todayDate });
            const tariffsData: ITariffBatch = {
                date: todayDate,
                dtNextBox: apiData.response.data.dtNextBox,
                dtTillMax: apiData.response.data.dtTillMax,
                warehouseList: apiData.response.data.warehouseList
            };
            
            const warehouseList = tariffsData.warehouseList

            await knex.transaction(async trx => {
                let tariffsBatch = await this.tariffsRepository.findBatchByDate(todayDate, trx);
                console.log('tariffsBatch:', JSON.stringify(tariffsBatch));

                if (!tariffsBatch) {
                    tariffsBatch = await this.tariffsRepository.insertBatch({
                        dt_next_box: tariffsData.dtNextBox,
                        dt_till_max: tariffsData.dtTillMax,
                        date: todayDate,
                    }, trx);
                }

                await this.tariffsRepository.deleteBoxTariffs(tariffsBatch.id, trx);

                // insert tariff warehouses
                const rows = warehouseList.map(tariff => ({
                    batch_id: tariffsBatch.id,
                    box_delivery_base: this.stringAsNumberValuePipe(tariff.boxDeliveryBase),
                    box_delivery_coef_expr: this.stringAsNumberValuePipe(tariff.boxDeliveryCoefExpr),
                    box_delivery_liter: this.stringAsNumberValuePipe(tariff.boxDeliveryLiter),
                    box_delivery_marketplace_base: this.stringAsNumberValuePipe(tariff.boxDeliveryMarketplaceBase),
                    box_delivery_marketplace_coef_expr: this.stringAsNumberValuePipe(tariff.boxDeliveryMarketplaceCoefExpr),
                    box_delivery_marketplace_liter: this.stringAsNumberValuePipe(tariff.boxDeliveryMarketplaceLiter),
                    box_storage_base: this.stringAsNumberValuePipe(tariff.boxStorageBase),
                    box_storage_coef_expr: this.stringAsNumberValuePipe(tariff.boxStorageCoefExpr),
                    box_storage_liter: this.stringAsNumberValuePipe(tariff.boxStorageLiter),
                    geo_name: tariff.geoName,
                    warehouse_name: tariff.warehouseName,
                }));
                
                await trx('box_tariffs').insert(rows);
            });


            
            // await trx.commit();
        } catch (err) {
            handleError(new ServiceError({
                code: "service_error",
                text: "Something went wrong during sync work",
                data: err as Error
            }))
        }
    }
    
    async fetchWbApi(reqParams: Record<string, string>): Promise<IWbApiResponse> {

        console.log('WB API URL: ' + this.WB_TARIFF_API_URL)
        const url = `${this.WB_TARIFF_API_URL}?${new URLSearchParams(reqParams)}`;
        const props: RequestInit = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.WB_API_BEARER_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
        console.log('REQUEST TO URL: ' + url);
        
        const response = await fetch(url, props);

        this.handleWbApiErrors(response);

        const data: IWbApiResponse = await response.json();
        console.log("[WB API] Response:", data);
                    
        return data;
    }

    private async handleWbApiErrors(response: Response): Promise<void> {

        if (response.status === 503) {
            handleError(new ServerTemporarilyUnavailableError({
                code: "service_temporarily_unavailable",
                text: "Service temporarily unavailable",
            }));
        }

        if (!response.ok) {
            handleError(new ServiceError({
                code: "external_api_error",
                text: `External API error (status ${response.status})`,
                data: { status: response.status, url: response.url },
            }));
        }
    }

    getToday(): string {
        const date = new Date().toISOString().slice(0, 10); 
        console.log(`Date: ${date}`);
        return date;
    }

    stringAsNumberValuePipe(field: string) {
        return field === "-" ? null : field;
    }
}