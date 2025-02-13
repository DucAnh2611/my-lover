const { EntitySchema } = require("typeorm");

const QuestionRequirementEntity = new EntitySchema({
    name: "question_requirement",
    table: "question_requirement",
    columns: {
        id: {
            type: "uuid",
            generated: "uuid",
            primary: true,
        },
        targetId: {
            type: "uuid",
        },
        requirementId: {
            type: "uuid",
        },
    },
    relations: {
        target: {
            target: "question",
            type: "many-to-one",
            joinColumn: {
                name: "questionId",
            },
            inverseSide: "questionTarget",
        },
        requirement: {
            target: "question",
            type: "many-to-one",
            joinColumn: {
                name: "requirementId",
            },
            inverseSide: "questionRequirement",
        },
    },
});

module.exports = QuestionRequirementEntity;
