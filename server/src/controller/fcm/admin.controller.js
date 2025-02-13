const FcmAdminService = require("../../service/fcm/admin.service");

const FcmAdminController = {
    save: async function (req, res, next) {
        const { id } = req.payload;
        const { token } = req.body;

        const save = await FcmAdminService.save({ codeId: id, token });

        return res.status(save.status).json(save);
    },
    activate: async function (req, res, next) {
        const { id: fcmId } = req.body;

        const activate = await FcmAdminService.activate({
            active: true,
            id: fcmId,
        });

        return res.status(activate.status).json(activate);
    },
    deactivate: async function (req, res, next) {
        const { id: fcmId } = req.body;

        const activate = await FcmAdminService.activate({
            active: false,
            id: fcmId,
        });

        return res.status(activate.status).json(activate);
    },
};

module.exports = FcmAdminController;
