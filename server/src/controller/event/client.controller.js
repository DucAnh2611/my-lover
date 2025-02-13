const EventClientService = require("../../service/event/client.service");

const EventClientController = {
    list: async function (req, res, next) {
        const payload = req.payload;

        const list = await EventClientService.list(payload.id);

        return res.status(list.status).json(list);
    },
    detail: async function (req, res, next) {
        const { id } = req.params;
        const payload = req.payload;

        const detail = await EventClientService.detail(payload.id, id);

        return res.status(detail.status).json(detail);
    },
    entry: async function (req, res, next) {
        const { id } = req.params;
        const payload = req.payload;

        const entry = await EventClientService.entry(payload.id, id);

        return res.status(entry.status).json(entry);
    },
    takePrize: async function (req, res, next) {
        const { id } = req.params;
        const payload = req.payload;

        const prize = await EventClientService.takePrize(payload.id, id);

        return res.status(prize.status).json(prize);
    },
};

module.exports = EventClientController;
