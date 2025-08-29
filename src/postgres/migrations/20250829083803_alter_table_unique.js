/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  await knex.schema.alterTable("tariff_batches", (table) => {
    table.date("date").notNullable().unique().alter();
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  await knex.schema.alterTable('tariff_batches', (table) => {
    table.dropUnique(['date']);
  });
}
