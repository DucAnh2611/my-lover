const { EntitySchema } = require("typeorm");

const EventEntity = new EntitySchema({
    name: "event",
    tableName: "event",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: "uuid",
        },
        name: {
            type: "varchar",
            length: 255,
        },
        description: {
            type: "text",
            nullable: true,
            default: null,
        },
        prize: {
            type: "text",
            nullable: true,
            default: null,
        },
        start: {
            type: "timestamp with time zone",
        },
        end: {
            type: "timestamp with time zone",
            nullable: true,
        },
        deletedAt: {
            type: "timestamp with time zone",
            deleteDate: true,
        },
    },
    relations: {
        question: {
            target: "question",
            type: "one-to-many",
            inverseSide: "event",
        },
        eventCode: {
            target: "event_code",
            type: "one-to-many",
            inverseSide: "event",
        },
    },
});

module.exports = EventEntity;
