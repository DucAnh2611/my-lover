const FcmAdminRoute = require("./admin");

const FcmRoute = require("express").Router();

FcmRoute.use("/admin", FcmAdminRoute);

module.exports = FcmRoute;
