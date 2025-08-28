/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.alterTable('tariff_batches', (table) => {
        table.date('date');
    });}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.alterTable('tariff_batches', (table) => {
        table.dropColumn('date');
    });}
