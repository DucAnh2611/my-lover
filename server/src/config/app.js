const env = require("../lib/env");

const AppConfig = {
    nodeEnv: env.NODE_ENV,
    port: env.APP_PORT,
}

module.exports = AppConfig;