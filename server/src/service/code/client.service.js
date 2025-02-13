const JwtConfig = require("../../config/jwt");
const ResponseFormat = require("../../helper/response");
const { JwtEncode } = require("../../lib/jwt");
const { CodeRepository } = require("../../repository/code");

const CodeClientService = {
    auth: async ({ code }) => {
        if (!code) {
            return ResponseFormat.badRequest("Chưa cung cấp code!");
        }

        const codeExist = await CodeRepository.findOne({
            where: {
                code,
            },
            loadEagerRelations: false,
        });

        if (!codeExist) {
            return ResponseFormat.badRequest("Code không tồn tại!");
        }

        if (!codeExist.isActive) {
            return ResponseFormat.badRequest("Code đang bị vô hiệu hóa!");
        }

        await CodeRepository.update(
            {
                id: codeExist.id,
            },
            {
                isOnline: true,
            }
        );

        const accessToken = JwtEncode(
            {
                code,
                type: codeExist.type,
                id: codeExist.id,
            },
            JwtConfig.secret,
            {
                expiresIn: JwtConfig.expire,
            }
        );

        return ResponseFormat.ok({ accessToken });
    },
    logout: async ({ codeId }) => {
        if (!codeId) {
            return ResponseFormat.badRequest("Chưa cung cấp code!");
        }

        const codeExist = await CodeRepository.findOne({
            where: {
                id: codeId,
            },
            loadEagerRelations: false,
        });

        if (!codeExist) {
            return ResponseFormat.badRequest("Code không tồn tại!");
        }

        await CodeRepository.update(
            {
                id: codeExist.id,
            },
            {
                isOnline: false,
            }
        );

        return ResponseFormat.ok();
    },
};

module.exports = CodeClientService;
