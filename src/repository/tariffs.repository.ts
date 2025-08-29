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
      box_delivery_base: t.box_delivery_base,
      box_delivery_coef_expr: t.box_delivery_coef_expr,
      box_delivery_liter: t.box_delivery_liter,
      box_delivery_marketplace_base: t.box_delivery_marketplace_base,
      box_delivery_marketplace_coef_expr: t.box_delivery_marketplace_coef_expr,
      box_delivery_marketplace_liter: t.box_delivery_marketplace_liter,
      box_storage_base: t.box_storage_base,
      box_storage_coef_expr: t.box_storage_coef_expr,
      box_storage_liter: t.box_storage_liter,
      geo_name: t.geo_name,
      warehouse_name: t.warehouse_name
    }));

    await (trx ?? this.knex)('box_tariffs').insert(rows);
  }
}
