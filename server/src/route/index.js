const CodeRoute = require("./code");
const EventRoute = require("./event");
const FcmRoute = require("./fcm");
const QuestionRoute = require("./question");

const Routes = (app) => {
    app.use("/code", CodeRoute);
    app.use("/event", EventRoute);
    app.use("/fcm", FcmRoute);
    app.use("/question", QuestionRoute);

    return app;
};

module.exports = Routes;
