const QuestionCodeEntity = require("../entity/question-code");
const { AppDataSource } = require("../lib/database");

const QuestionCodeRepository = AppDataSource.getRepository(QuestionCodeEntity);

module.exports = QuestionCodeRepository;
