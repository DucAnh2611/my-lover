const EventClientController = require("../../controller/event/client.controller");
const AccessTokenMiddleware = require("../../middleware/access");
const ActiveCodeMiddleware = require("../../middleware/active-code");

const EventClientRoute = require("express").Router();

EventClientRoute.get(
    "/",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    EventClientController.list
);
EventClientRoute.get(
    "/:id",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    EventClientController.detail
);
EventClientRoute.post(
    "/prize/take/:id",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    EventClientController.takePrize
);

EventClientRoute.post(
    "/entry/:id",
    AccessTokenMiddleware,
    ActiveCodeMiddleware,
    EventClientController.entry
);

module.exports = EventClientRoute;
