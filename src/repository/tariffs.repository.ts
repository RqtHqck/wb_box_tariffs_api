import { IBoxTariff } from "#interfaces/tariff.interface.js";
import { Knex } from "knex";


export class TariffsRepository {
  constructor(private readonly knex: Knex) {}

async findBatchByDate(date: string, trx?: Knex.Transaction) {
  const query = (trx ?? this.knex)('tariff_batches as tb')
    .leftJoin('box_tariffs as bt', 'tb.id', 'bt.batch_id')
    .select(
      'tb.id',
      'tb.date',
      'tb.dt_next_box',
      'tb.dt_till_max',
      this.knex.raw('json_agg(bt.*) filter (where bt.id is not null) as box_tariffs')
    )
    .where('tb.date', date)
    .groupBy('tb.id')
    .first();

  return query;
}


  async insertBatch(data: any, trx?: Knex.Transaction) {
    const query = (trx ?? this.knex)('tariff_batches')
      .insert(data)
      .returning('id');
    
    const [batch] = await query;
    return batch;
  }

  async deleteBoxTariffs(batchId: number, trx?: Knex.Transaction) {
    await (trx ?? this.knex)('box_tariffs').where({ batch_id: batchId }).del();
  }

  async insertBoxTariffs(batchId: number, tariffs: IBoxTariff[], trx?: Knex.Transaction) {
    const rows = tariffs.map(t => ({
      batch_id: batchId,
      box_delivery_base: t.boxDeliveryBase,
      box_delivery_coef_expr: t.boxDeliveryCoefExpr,
      box_delivery_liter: t.boxDeliveryLiter,
      box_delivery_marketplace_base: t.boxDeliveryMarketplaceBase,
      box_delivery_marketplace_coef_expr: t.boxDeliveryMarketplaceCoefExpr,
      box_delivery_marketplace_liter: t.boxDeliveryMarketplaceLiter,
      box_storage_base: t.boxStorageBase,
      box_storage_coef_expr: t.boxStorageCoefExpr,
      box_storage_liter: t.boxStorageLiter,
      geo_name: t.geoName,
      warehouse_name: t.warehouseName
    }));
    await (trx ?? this.knex)('box_tariffs').insert(rows);
  }
}
