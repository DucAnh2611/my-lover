const lodash = require("../lib/lodash");

function compareArraysByAttributes(array1, array2, attributes) {
    if (!lodash.isArray(array1) || !lodash.isArray(array2)) return false;
    if (array1.length !== array2.length) {
        return false;
    }
    for (let i = 0; i < array1.length; i++) {
        const obj1 = lodash.pick(array1[i], attributes);
        const obj2 = lodash.pick(array2[i], attributes);

        if (!lodash.isEqual(obj1, obj2)) {
            return false;
        }
    }
    return true;
}

module.exports = { compareArraysByAttributes };
