const env = require("../lib/env");

const DatabaseConfig = {
    app: {
        type: env.DB_TYPE,
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
    },
    user: {
        type: env.DB_USER_TYPE,
        host: env.DB_USER_HOST,
        port: env.DB_USER_PORT,
        username: env.DB_USER_USERNAME,
        password: env.DB_USER_PASSWORD,
        database: env.DB_USER_DATABASE,
    },
};

module.exports = DatabaseConfig;
