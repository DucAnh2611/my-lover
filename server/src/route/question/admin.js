const QuestionAdminController = require("../../controller/question/admin.controller");
const AccessTokenMiddleware = require("../../middleware/access");
const ActiveCodeMiddleware = require("../../middleware/active-code");
const MeMiddleware = require("../../middleware/me");

const QuestionAdminRoute = require("express").Router();

QuestionAdminRoute.get(
    "/:eid/list",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    QuestionAdminController.list
);

QuestionAdminRoute.post(
    "/",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    QuestionAdminController.create
);
QuestionAdminRoute.post(
    "/query/run",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    QuestionAdminController.runQuery
);

QuestionAdminRoute.post(
    "/reset",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    QuestionAdminController.reset
);

QuestionAdminRoute.put(
    "/",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    QuestionAdminController.update
);

QuestionAdminRoute.delete(
    "/",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    QuestionAdminController.delete
);

module.exports = QuestionAdminRoute;
