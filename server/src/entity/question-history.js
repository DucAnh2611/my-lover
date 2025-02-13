const { EntitySchema } = require("typeorm");
const { QUESTION_HISTORY_CONSTANT } = require("../constant/question");

const QuestionHistoryEntity = new EntitySchema({
    name: "question_history",
    tableName: "question_history",
    columns: {
        id: {
            type: "uuid",
            generated: "uuid",
            primary: true,
        },
        questionCodeId: {
            type: "uuid",
        },
        status: {
            type: "enum",
            enum: QUESTION_HISTORY_CONSTANT.status.enums,
        },
        answere: {
            type: "text",
            nullable: true,
            default: null,
        },
        createdAt: {
            type: "timestamp with time zone",
            createDate: true,
        },
    },
    relations: {
        questionCode: {
            target: "question_code",
            type: "many-to-one",
            joinColumn: {
                name: "questionCodeId",
            },
            inverseSide: "questionHistory",
        },
    },
});

module.exports = QuestionHistoryEntity;
