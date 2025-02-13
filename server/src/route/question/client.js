const QuestionClientController = require("../../controller/question/client.controller");
const AccessTokenMiddleware = require("../../middleware/access");
const ActiveCodeMiddleware = require("../../middleware/active-code");

const QuestionClientRoute = require("express").Router();

QuestionClientRoute.get(
    "/:eid/list",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    QuestionClientController.list
);

QuestionClientRoute.post(
    "/:id/check",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    QuestionClientController.check
);
QuestionClientRoute.post(
    "/:id/start",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    QuestionClientController.start
);
QuestionClientRoute.post(
    "/:id/submit",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    QuestionClientController.submit
);

module.exports = QuestionClientRoute;
