

export interface IBoxTariff {
  boxDeliveryBase: number | string;
  boxDeliveryCoefExpr: number | string;
  boxDeliveryLiter: number | string;
  boxDeliveryMarketplaceBase: number | string;
  boxDeliveryMarketplaceCoefExpr: number | string;
  boxDeliveryMarketplaceLiter: number | string;
  boxStorageBase: number | string;
  boxStorageCoefExpr: number | string;
  boxStorageLiter: number | string;
  geoName: string;
  warehouseName: string;
}

export interface ITariffBatch {
  dtNextBox: Date;
  dtTillMax: Date;
  warehouseList: IBoxTariff[]
}