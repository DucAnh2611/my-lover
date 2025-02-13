const CodeClientController = require("../../controller/code/client.controller");
const AccessTokenMiddleware = require("../../middleware/access");

const CodeClientRoute = require("express").Router();

CodeClientRoute.post("/auth", CodeClientController.auth);
CodeClientRoute.post(
    "/logout",
    AccessTokenMiddleware,
    CodeClientController.logout
);

module.exports = CodeClientRoute;
