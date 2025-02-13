const { EntitySchema, JoinColumn } = require("typeorm");

const EventCodeEntity = new EntitySchema({
    name: "event_code",
    tableName: "event_code",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: "uuid",
        },
        data: {
            type: "jsonb",
            nullable: true,
        },
        codeId: {
            type: "uuid",
            nullable: false,
        },
        eventId: {
            type: "uuid",
            nullable: false,
        },
    },
    relations: {
        code: {
            target: "code",
            type: "many-to-one",
            JoinColumn: {
                name: "codeId",
            },
            inverseSide: "eventCode",
        },
        event: {
            target: "event",
            type: "many-to-one",
            JoinColumn: {
                name: "eventId",
            },
            inverseSide: "eventCode",
        },
    },
});

module.exports = EventCodeEntity;
