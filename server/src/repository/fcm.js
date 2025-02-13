const FcmEntity = require("../entity/fcm");
const { AppDataSource } = require("../lib/database");

const FcmRepository = AppDataSource.getRepository(FcmEntity);

module.exports = FcmRepository;
