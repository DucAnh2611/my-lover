const CookieConfig = require("../../config/cookie");
const JwtConfig = require("../../config/jwt");
const CodeClientService = require("../../service/code/client.service");

const CodeClientController = {
    auth: async function (req, res, next) {
        const body = req.body;

        const auth = await CodeClientService.auth(body);

        if (auth.data) {
            const { accessToken } = auth.data;

            res.cookie(CookieConfig.name, accessToken, {
                maxAge: JwtConfig.expire * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
        }

        delete auth.data;

        return res.status(auth.status).json(auth);
    },
    logout: async function (req, res, next) {
        const { id: codeId } = req.payload;

        const logouted = await CodeClientService.logout({ codeId });

        res.clearCookie(CookieConfig.name);

        return res.status(logouted.status).json(logouted);
    },
};

module.exports = CodeClientController;
