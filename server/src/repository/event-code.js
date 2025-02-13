const EventCodeEntity = require("../entity/event-code");
const { AppDataSource } = require("../lib/database");

const EventCodeRepository = AppDataSource.getRepository(EventCodeEntity);

module.exports = EventCodeRepository;
