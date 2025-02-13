const QuestionClientService = require("../../service/question/client.service");

const QuestionClientController = {
    list: async function (req, res) {
        const { id: codeId } = req.payload;
        const { eid: eventId } = req.params;

        const listed = await QuestionClientService.tree(codeId, eventId);

        return res.status(listed.status).json(listed);
    },
    start: async function (req, res) {
        const { id: codeId } = req.payload;
        const { id: questionId } = req.params;

        const started = await QuestionClientService.start(codeId, questionId);

        return res.status(started.status).json(started);
    },
    check: async function (req, res) {
        const { id: codeId } = req.payload;
        const { query } = req.body;
        const { id: questionId } = req.params;

        const checked = await QuestionClientService.validateAnswere(
            codeId,
            questionId,
            query
        );

        return res.status(checked.status).json(checked);
    },
    submit: async function (req, res) {
        const { id: codeId } = req.payload;
        const { id: questionId } = req.params;
        const body = req.body;

        const submitted = await QuestionClientService.submit(
            codeId,
            questionId,
            body
        );

        return res.status(submitted.status).json(submitted);
    },
};

module.exports = QuestionClientController;
