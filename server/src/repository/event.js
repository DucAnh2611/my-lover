const EventEntity = require("../entity/event");
const { AppDataSource } = require("../lib/database");

const EventRepository = AppDataSource.getRepository(EventEntity);

module.exports = EventRepository;
