const express = require("express");
const AppConfig = require("./src/config/app");
const bodyParser = require("body-parser");
const FirebaseAdminInitial = require("./src/lib/firebase");
const { DatabaseConnection } = require("./src/lib/database");
const Routes = require("./src/route");
const cookieParser = require("cookie-parser");
const cors = require("cors");

function main() {
    DatabaseConnection();
    FirebaseAdminInitial();

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(
        cors({
            origin: ["http://localhost:3001"],
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            credentials: true,
        })
    );

    Routes(app);

    app.listen(AppConfig.port, () => {
        console.log(`[Done] App listening on ${AppConfig.port}`);
    });
}

main();
