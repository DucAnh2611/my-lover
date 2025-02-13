const CodeAdminService = require("../../service/code/admin.service");

const CodeAdminController = {
    list: async function (req, res, next) {
        const list = await CodeAdminService.list();

        return res.status(list.status || 200).json(list);
    },
    create: async function (req, res, next) {
        const body = req.body;

        const created = await CodeAdminService.create(body);

        return res.status(created.status || 200).json(created);
    },
    activate: async function (req, res, next) {
        const { code } = req.params;

        const activate = await CodeAdminService.activeState({
            active: true,
            code,
        });

        return res.status(activate.status || 200).json(activate);
    },
    deactivate: async function (req, res, next) {
        const { code } = req.params;

        const deactivate = await CodeAdminService.activeState({
            active: false,
            code,
        });

        return res.status(deactivate.status || 200).json(deactivate);
    },
    changeCode: async function (req, res, next) {
        const body = req.body;

        const changeCode = await CodeAdminService.changeCode(body);

        return res.status(changeCode.status || 200).json(changeCode);
    },
    deleteCode: async function (req, res, next) {
        const { code } = req.params;

        const deleteCode = await CodeAdminService.deleteCode({ code });

        return res.status(deleteCode.status).json(deleteCode);
    },
};

module.exports = CodeAdminController;
