const CODE_CONSTANTS = require("../constant/code");
const ResponseFormat = require("../helper/response");

async function MeMiddleware(req, res, next) {
    if (!req.payload) {
        return res
            .status(401)
            .json(ResponseFormat.error(401, "Chưa xác thực code!"));
    }

    if (req.payload.type !== CODE_CONSTANTS.TYPES[0]) {
        return res
            .status(401)
            .json(
                ResponseFormat.error(
                    401,
                    "Code của bạn không có quyền truy cập!"
                )
            );
    }

    return next();
}

module.exports = MeMiddleware;
