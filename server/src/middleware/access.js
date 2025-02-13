const CookieConfig = require("../config/cookie");
const JwtConfig = require("../config/jwt");
const ResponseFormat = require("../helper/response");
const { JwtVerify } = require("../lib/jwt");

const AccessTokenMiddleware = (req, res, next) => {
    const cookie = req.cookies;

    const accessToken = cookie[CookieConfig.name];

    if (!accessToken) {
        return res
            .status(401)
            .json(
                ResponseFormat.error(
                    401,
                    "Chưa xác thực code!",
                    "Invalid Token!"
                )
            );
    }

    const accessPayload = JwtVerify(accessToken, JwtConfig.secret);

    req.payload = accessPayload;

    return next();
};

module.exports = AccessTokenMiddleware;
