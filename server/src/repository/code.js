const CodeEntity = require("../entity/code");
const { AppDataSource } = require("../lib/database");

const CodeRepository = AppDataSource.getRepository(CodeEntity);

module.exports = { CodeRepository };
