import env from "#config/env/env.js";
import { BaseError } from "#errors/BaseError.js";
import { ServiceError } from "#errors/Service.error.js";
import ServerTemporarilyUnavailableError from "#errors/ServiceTemporarilyUnavailable.error.js";
import { IWbApiResponse } from "#interfaces/responses.interface.js";
import { handleError } from "#utils/errorHandler.js";

export class TariffsService {
    private WB_TARIFF_API_URL = env.WB_TARIFF_API_URL
    private WB_API_BEARER_TOKEN = env.WB_API_BEARER_TOKEN

    constructor() {}

    async syncTariffs(): Promise<void> {
        const date = this.getToday();
        
        const tariffsBatch = this.fetchWbApi({date})
            .then(data => data.response.data);
        console.log(tariffsBatch);

        
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
}