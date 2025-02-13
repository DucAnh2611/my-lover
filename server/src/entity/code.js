const { EntitySchema } = require("typeorm");
const CODE_CONSTANTS = require("../constant/code");

const CodeEntity = new EntitySchema({
    name: "code",
    tableName: "code",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        code: {
            type: "varchar",
            length: 6,
            nullable: false,
        },
        type: {
            type: "enum",
            enum: CODE_CONSTANTS.TYPES,
            nullable: false,
        },
        isActive: {
            type: "boolean",
            default: false,
        },
        isOnline: {
            type: "boolean",
            default: false,
        },
        deletedAt: {
            type: "timestamp with time zone",
            deleteDate: true,
        },
    },
    relations: {
        eventCode: {
            target: "event_code",
            type: "one-to-many",
            inverseSide: "code",
        },
        questionCode: {
            target: "question_code",
            type: "one-to-many",
            inverseSide: "question",
        },
    },
    listeners: {
        beforeInsert(event) {
            event.isOnline = false;

            if (event.type === CODE_CONSTANTS.TYPES[0]) {
                event.isActive = true;
            }
        },
    },
});

module.exports = CodeEntity;
