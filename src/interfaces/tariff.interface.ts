export interface IBoxTariff {
  box_delivery_base: string | null;
  box_delivery_coef_expr: string | null;
  box_delivery_liter: string | null;
  box_delivery_marketplace_base: string | null;
  box_delivery_marketplace_coef_expr: string | null;
  box_delivery_marketplace_liter: string | null;
  box_storage_base: string | null;
  box_storage_coef_expr: string | null;
  box_storage_liter: string | null;
  geo_name: string;
  warehouse_name: string;
}


export interface ITariffBatch {
  date: string;
  dt_next_box: Date;
  dt_till_max: Date;
  warehouse_list: IBoxTariff[];
}

export interface ITariffGoogleSheet extends IBoxTariff {
  date: Date;
  dt_next_box: Date;
  dt_till_max: Date;
}
