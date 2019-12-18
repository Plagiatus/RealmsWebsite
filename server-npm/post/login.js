"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const main_1 = require("../main");
async function login(_input, _response) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    if (!email || !token || !uuid) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email, token, uuid);
        await main_1.auth.validate(p);
        _response.write(JSON.stringify(p));
    }
}
exports.login = login;
