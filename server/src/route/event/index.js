const EventAdminRoute = require("./admin");
const EventClientRoute = require("./client");

const EventRoute = require("express").Router();

EventRoute.use("/admin", EventAdminRoute);
EventRoute.use("/client", EventClientRoute);

module.exports = EventRoute;
