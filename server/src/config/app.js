const env = require("../lib/env");

const AppConfig = {
    nodeEnv: env.NODE_ENV,
    port: env.APP_PORT,
    selfUrl: env.SELF_CALL_URL,
};

module.exports = AppConfig;
