const { EntitySchema } = require("typeorm");
const { QUESTION_CODE_CONSTANT } = require("../constant/question");

const QuestionCodeEntity = new EntitySchema({
    name: "question_code",
    tableName: "question_code",
    columns: {
        id: {
            type: "uuid",
            generated: "uuid",
            primary: true,
        },
        status: {
            type: "enum",
            enum: QUESTION_CODE_CONSTANT.status.enums,
        },
        questionId: {
            type: "uuid",
        },
        codeId: {
            type: "uuid",
        },
    },
    relations: {
        question: {
            target: "question",
            type: "many-to-one",
            joinColumn: {
                name: "questionId",
            },
            inverseSide: "questionCode",
        },
        code: {
            target: "code",
            type: "many-to-one",
            joinColumn: {
                name: "codeId",
            },
            inverseSide: "questionCode",
        },
        questionHistory: {
            target: "question_history",
            type: "one-to-many",
            inverseSide: "questionCode",
        },
    },
});

module.exports = QuestionCodeEntity;
