import { TErrorData } from "#errors/BaseError.js";
import { ITariffBatch } from "./tariff.interface.js";

export type ErrorResponse = {
  status: number;
  body: {
    code: string;
    text: string;
    data?: TErrorData | unknown;
  };
};



export type IWbApiResponse = {
  response: {
    data: {
      dtNextBox: Date;
      dtTillMax: Date;
      warehouseList: Array<{
        boxDeliveryBase: string;
        boxDeliveryCoefExpr: string;
        boxDeliveryLiter: string;
        boxDeliveryMarketplaceBase: string;
        boxDeliveryMarketplaceCoefExpr: string;
        boxDeliveryMarketplaceLiter: string;
        boxStorageBase: string;
        boxStorageCoefExpr: string;
        boxStorageLiter: string;
        geoName: string;
        warehouseName: string;
      }>
    }
  }
};
