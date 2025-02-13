const QuestionEntity = require("../entity/question");
const { AppDataSource } = require("../lib/database");

const QuestionRepository = AppDataSource.getRepository(QuestionEntity);

module.exports = QuestionRepository;
