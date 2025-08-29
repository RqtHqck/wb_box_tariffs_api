export interface IBoxTariff {
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
}

export interface ITariffBatch {
  date: string;
  dtNextBox: Date;
  dtTillMax: Date;
  warehouseList: IBoxTariff[]
}

export interface ITariffGoogleSheet extends IBoxTariff {
  date: Date;
  dtNextBox: Date;
  dtTillMax: Date;
}