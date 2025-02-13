const ResponseFormat = require("../../helper/response");
const { CodeRepository } = require("../../repository/code");
const FcmRepository = require("../../repository/fcm");

const FcmAdminService = {
    save: async ({ codeId, token }) => {
        const isExist = await FcmRepository.findOne({
            token: token,
        });

        try {
            if (!isExist) {
                const instance = FcmRepository.create({
                    token,
                });
                await FcmRepository.save(instance);
            }

            return ResponseFormat.ok();
        } catch (err) {
            return ResponseFormat.internal;
        }
    },
    activate: async ({ id, active }) => {
        const isExist = await FcmRepository.findOne({
            id,
        });

        if (!isExist) {
            return ResponseFormat.badRequest("Không tồn tại token này!");
        }

        try {
            await FcmRepository.update(
                {
                    id,
                },
                { isActive: active }
            );

            return ResponseFormat.ok();
        } catch (err) {
            return ResponseFormat.internal;
        }
    },
};

module.exports = FcmAdminService;
