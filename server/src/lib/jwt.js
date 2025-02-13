const { sign, decode, verify } = require("jsonwebtoken");

function JwtEncode(data, key, options) {
    return sign(data, key, options);
}

function JwtVerify(encoded, key) {
    return verify(encoded, key);
}

module.exports = { JwtEncode, JwtVerify };
