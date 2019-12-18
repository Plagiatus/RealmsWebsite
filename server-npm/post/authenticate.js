"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const main_1 = require("../main");
async function authenticate(_input, _response) {
    let email = _input.email;
    let pw = _input.password;
    if (!email || !pw) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email);
        await main_1.auth.authenticate(p, pw);
        _response.write(JSON.stringify(p));
    }
}
exports.authenticate = authenticate;
