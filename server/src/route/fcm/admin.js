const FcmAdminController = require("../../controller/fcm/admin.controller");

const FcmAdminRoute = require("express").Router();

FcmAdminRoute.post("/save", FcmAdminController.save);

FcmAdminRoute.put("/activate", FcmAdminController.activate);
FcmAdminRoute.put("/deactivate", FcmAdminController.deactivate);

module.exports = FcmAdminRoute;
