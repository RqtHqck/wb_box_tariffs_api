/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.alterTable('box_tariffs', (table) => {
        table.text('box_delivery_base').nullable().alter();
        table.text('box_delivery_coef_expr').nullable().alter();
        table.text('box_delivery_liter').nullable().alter();
        table.text('box_delivery_marketplace_base').nullable().alter();
        table.text('box_delivery_marketplace_coef_expr').nullable().alter();
        table.text('box_delivery_marketplace_liter').nullable().alter();
        table.text('box_storage_base').nullable().alter();
        table.text('box_storage_coef_expr').nullable().alter();
        table.text('box_storage_liter').nullable().alter();
    })
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.alterTable('box_tariffs', (table) => {
        table.decimal('box_delivery_base').nullable().alter();
        table.decimal('box_delivery_coef_expr').nullable().alter();
        table.decimal('box_delivery_liter').nullable().alter();
        table.decimal('box_delivery_marketplace_base').nullable().alter();
        table.decimal('box_delivery_marketplace_coef_expr').nullable().alter();
        table.decimal('box_delivery_marketplace_liter').nullable().alter();
        table.decimal('box_storage_base').nullable().alter();
        table.decimal('box_storage_coef_expr').nullable().alter();
        table.decimal('box_storage_liter').nullable().alter();

    });
}
