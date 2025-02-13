const env = require("../lib/env");

const JwtConfig = {
    secret: env.TOKEN_SECRET,
    expire: parseInt(env.TOKEN_EXPIRE),
};

module.exports = JwtConfig;
