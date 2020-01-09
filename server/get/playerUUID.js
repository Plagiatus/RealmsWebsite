"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request = require("request-promise-native/");
async function playerUUID(_input, _response) {
    let name = _input.name;
    if (!name) {
        throw new Error("Not enough parameters given.");
    }
    _response.write(await Request("https://api.mojang.com/users/profiles/minecraft/" + name));
}
exports.playerUUID = playerUUID;
