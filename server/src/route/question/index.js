const QuestionAdminRoute = require("./admin");
const QuestionClientRoute = require("./client");

const QuestionRoute = require("express").Router();

QuestionRoute.use("/admin", QuestionAdminRoute);
QuestionRoute.use("/client", QuestionClientRoute);

module.exports = QuestionRoute;
