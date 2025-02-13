const ResponseFormat = require("../helper/response");
const { CodeRepository } = require("../repository/code");

async function ActiveCodeMiddleware(req, res, next) {
    if (!req.payload) {
        return res
            .status(401)
            .json(ResponseFormat.error(401, "Chưa xác thực code!"));
    }

    const existCode = await CodeRepository.findOne({
        where: {
            code: req.payload.code,
        },
        loadEagerRelations: false,
    });

    if (!existCode) {
        return res
            .status(404)
            .json(ResponseFormat.error(404, "Code của bạn không tồn tại!"));
    }

    if (!existCode.isActive) {
        return res
            .status(401)
            .json(
                ResponseFormat.error(401, "Code của bạn đang bị vô hiệu hóa!")
            );
    }

    return next();
}

module.exports = ActiveCodeMiddleware;
