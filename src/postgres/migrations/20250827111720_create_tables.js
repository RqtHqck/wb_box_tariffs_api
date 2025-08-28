/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    await knex.schema.createTable("tariff_batches", (t) => {
        t.increments("id").primary();
        t.date("dt_next_box").notNullable();
        t.date("dt_till_max").notNullable();
        t.timestamps(true, true);
    })

    .createTable("box_tariffs", (t) => {
    t.increments("id").primary();
      t.integer("batch_id").unsigned().notNullable()
        .references("id")
        .inTable("tariff_batches")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");

    t.decimal("box_delivery_base").nullable();
    t.decimal("box_delivery_coef_expr").nullable();
    t.decimal("box_delivery_liter").nullable();
    
    t.decimal("box_delivery_marketplace_base").nullable();
    t.decimal("box_delivery_marketplace_coef_expr").nullable();
    t.decimal("box_delivery_marketplace_liter").nullable();
    
    t.decimal("box_storage_base").nullable();
    t.decimal("box_storage_coef_expr").nullable();
    t.decimal("box_storage_liter").nullable();
    
    t.string("geo_name").notNullable();
    t.string("warehouse_name").notNullable();
    t.timestamps(true, true);
    });
}


/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("box_tariffs");
    await knex.schema.dropTableIfExists("tariff_batches");
}
