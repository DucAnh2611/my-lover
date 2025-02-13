const EventAdminService = require("../../service/event/admin.service");

const EventAdminController = {
    list: async function (req, res, next) {
        const list = await EventAdminService.list();

        return res.status(list.status).json(list);
    },
    create: async function (req, res, next) {
        const body = req.body;
        const created = await EventAdminService.create(body);

        return res.status(created.status).json(created);
    },
    update: async function (req, res, next) {
        const body = req.body;
        const updated = await EventAdminService.update(body);

        return res.status(updated.status).json(updated);
    },
    delete: async function (req, res, next) {
        const body = req.body;
        const deleted = await EventAdminService.delete(body);

        return res.status(deleted.status).json(deleted);
    },
};

module.exports = EventAdminController;
