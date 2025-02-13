const QUESTION_CONSTANT = {
    queryTypes: {
        SELECT: "SELECT",
        INSERT: "INSERT",
        UPDATE: "UPDATE",
        DELETE: "DELETE",
        enums: ["SELECT", "INSERT", "UPDATE", "DELETE"],
    },
    validators: {},
};

const QUESTION_CODE_CONSTANT = {
    status: {
        PASS: "PASS",
        SOLVING: "SOLVING",
        LOCKED: "LOCKED",
        enums: ["PASS", "SOLVING"],
    },
};

const QUESTION_HISTORY_CONSTANT = {
    status: {
        INCORRECT: "INCORRECT",
        CORRECT: "CORRECT",
        PARTIAL: "PARTIAL",
        enums: ["INCORRECT", "CORRECT", "PARTIAL"],
    },
};

module.exports = {
    QUESTION_CONSTANT,
    QUESTION_CODE_CONSTANT,
    QUESTION_HISTORY_CONSTANT,
};
