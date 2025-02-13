const { QUERY_DANGEROUS_KEYS } = require("../constant/query");

const validateQuery = ({
    dangerousKeys = QUERY_DANGEROUS_KEYS,
    query = "",
}) => {
    for (const keyword of dangerousKeys.split(" | ")) {
        if (query.toLowerCase().includes(keyword.toLowerCase())) {
            return false;
        }
    }

    return true;
};

module.exports = { validateQuery };
