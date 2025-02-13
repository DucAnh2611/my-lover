const CodeAdminController = require("../../controller/code/admin.controller");
const AccessTokenMiddleware = require("../../middleware/access");
const ActiveCodeMiddleware = require("../../middleware/active-code");
const MeMiddleware = require("../../middleware/me");

const CodeAdminRoute = require("express").Router();

CodeAdminRoute.get(
    "/",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    CodeAdminController.list
);
CodeAdminRoute.get("/initMe", CodeAdminController.initMe);

CodeAdminRoute.post(
    "/",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    CodeAdminController.create
);

CodeAdminRoute.put(
    "/activate/:code",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    CodeAdminController.activate
);
CodeAdminRoute.put(
    "/deactivate/:code",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    CodeAdminController.deactivate
);

CodeAdminRoute.delete(
    "/:code",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    CodeAdminController.deleteCode
);

module.exports = CodeAdminRoute;
