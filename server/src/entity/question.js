const { EntitySchema } = require("typeorm");
const { QUESTION_CONSTANT } = require("../constant/question");

const QuestionEntity = new EntitySchema({
    name: "question",
    tableName: "question",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        title: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        no: { type: "integer", nullable: false, default: 0 },
        description: {
            type: "text",
            nullable: true,
        },
        content: {
            type: "text",
            default: "",
        },
        preRun: {
            type: "jsonb",
            nullable: true,
        },
        answere: {
            type: "jsonb",
            nullable: true,
        },
        retriable: {
            type: "boolean",
            default: false,
        },
        explain: {
            type: "text",
            nullable: true,
        },
        eventId: {
            type: "uuid",
            nullable: false,
        },
        deletedAt: {
            type: "timestamp with time zone",
            deleteDate: true,
        },
    },
    relations: {
        event: {
            target: "event",
            type: "many-to-one",
            joinColumn: {
                name: "eventId",
            },
            inverseSide: "question",
        },
        questionCode: {
            target: "question_code",
            type: "one-to-many",
            inverseSide: "question",
        },
        questionTarget: {
            target: "question_requirement",
            type: "one-to-many",
            inverseSide: "target",
        },
        questionRequirement: {
            target: "question_requirement",
            type: "one-to-many",
            inverseSide: "requirement",
        },
    },
});

module.exports = QuestionEntity;
