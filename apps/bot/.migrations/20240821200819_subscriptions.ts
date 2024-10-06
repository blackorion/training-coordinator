import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("subscriptions", (table) => {
        table.increments("id").primary();
        table.integer("user_id").notNullable().unique();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("subscriptions");
}

