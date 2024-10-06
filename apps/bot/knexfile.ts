import type { Knex } from "knex";

const defaultConfig: Knex.Config = {
    client: "sqlite3",
    connection: {
        filename: process.env.DB_CONNECTION_STRING || ":memory:",
    },
    migrations: {
        directory: ".migrations",
        tableName: "migrations",
    },
};

const config: Record<'development' | 'production', Knex.Config> = {
    development: {
        ...defaultConfig,
    },

    production: {
        ...defaultConfig,
        pool: {
            min: 2,
            max: 10,
        },
    },
};

export default config;
