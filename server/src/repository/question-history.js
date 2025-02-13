const QuestionHistoryEntity = require("../entity/question-history");
const { AppDataSource } = require("../lib/database");

const QuestionHistoryRepository = AppDataSource.getRepository(
    QuestionHistoryEntity
);

module.exports = QuestionHistoryRepository;
