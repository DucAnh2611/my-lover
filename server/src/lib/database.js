const { DataSource } = require("typeorm");
const DatabaseConfig = require("../config/database");
const FcmEntity = require("../entity/fcm");
const CodeEntity = require("../entity/code");
const QuestionEntity = require("../entity/question");
const AppConfig = require("../config/app");
const EventEntity = require("../entity/event");
const EventCodeEntity = require("../entity/event-code");
const QuestionCodeEntity = require("../entity/question-code");
const QuestionRequirementEntity = require("../entity/question-requirement");
const QuestionHistoryEntity = require("../entity/question-history");

const AppDataSource = new DataSource({
    ...DatabaseConfig.app,
    entities: [
        FcmEntity,
        CodeEntity,
        EventEntity,
        EventCodeEntity,
        QuestionEntity,
        QuestionCodeEntity,
        QuestionRequirementEntity,
        QuestionHistoryEntity,
    ],
    synchronize: AppConfig.nodeEnv === "dev",
    dropSchema: false,
});

const AppClientDataSource = new DataSource({
    ...DatabaseConfig.user,
    entities: [],
    synchronize: AppConfig.nodeEnv === "dev",
    dropSchema: false,
});

async function DatabaseConnection() {
    try {
        await AppDataSource.initialize();
        console.log("[Done] Database Connection");

        await AppClientDataSource.initialize();
        console.log("[Done] Database Client Connection");
    } catch (error) {
        console.log("=== Connection Database Error ===");
        console.error(error);
    }
}

module.exports = { DatabaseConnection, AppDataSource, AppClientDataSource };
