const QuestionAdminService = require("../../service/question/admin.service");

const QuestionAdminController = {
    list: async function (req, res) {
        const { eid: eventId } = req.params;
        const list = await QuestionAdminService.list(eventId);

        return res.status(list.status).json(list);
    },
    create: async function (req, res) {
        const body = req.body;

        const created = await QuestionAdminService.create(body);

        return res.status(created.status).json(created);
    },
    update: async function (req, res) {
        const body = req.body;

        const updated = await QuestionAdminService.update(body);

        return res.status(updated.status).json(updated);
    },
    delete: async function (req, res) {
        const { ids } = req.body;

        const deleted = await QuestionAdminService.delete({ questionIds: ids });

        return res.status(deleted.status).json(deleted);
    },

    async reset(req, res) {
        const { code, eventId } = req.body;

        const reseted = await QuestionAdminService.reset({ code, eventId });

        return res.status(reseted.status).json(reseted);
    },
    runQuery: async function (req, res) {
        const { query } = req.body;

        const ranQuery = await QuestionAdminService.runQuery(query);

        return res.status(ranQuery.status).json(ranQuery);
    },
};

module.exports = QuestionAdminController;
