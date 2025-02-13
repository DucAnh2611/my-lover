const EventAdminController = require("../../controller/event/admin.controller");
const AccessTokenMiddleware = require("../../middleware/access");
const ActiveCodeMiddleware = require("../../middleware/active-code");
const MeMiddleware = require("../../middleware/me");

const EventAdminRoute = require("express").Router();

EventAdminRoute.get(
    "/",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    EventAdminController.list
);

EventAdminRoute.post(
    "/",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    EventAdminController.create
);
EventAdminRoute.put(
    "/",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    EventAdminController.update
);
EventAdminRoute.delete(
    "/",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    MeMiddleware,
    EventAdminController.delete
);

module.exports = EventAdminRoute;
