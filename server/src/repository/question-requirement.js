const QuestionRequirementEntity = require("../entity/question-requirement");
const { AppDataSource } = require("../lib/database");

const QuestionRequirementRepository = AppDataSource.getRepository(
    QuestionRequirementEntity
);

module.exports = QuestionRequirementRepository;
