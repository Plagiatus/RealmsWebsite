"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const main_1 = require("../main");
async function invalidate(_input, _response) {
    let token = _input.token;
    if (!token) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player("", token, "");
        main_1.auth.invalidate(p);
        _response.write(JSON.stringify({ result: "ok" }));
    }
}
exports.invalidate = invalidate;
