const CodeAdminRoute = require("./admin");
const CodeClientRoute = require("./client");

const CodeRoute = require("express").Router();

CodeRoute.use("/admin", CodeAdminRoute);
CodeRoute.use("/client", CodeClientRoute);

module.exports = CodeRoute;
