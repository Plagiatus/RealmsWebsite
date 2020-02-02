"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const MR = require("../../realmsapi");
const main_1 = require("../main");
async function getIP(_input, _response) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    let name = _input.name;
    let world = Number(_input.world);
    if (!email || !token || !uuid || !name || !world) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email, token, uuid, name);
        let c = new MR.Client(p.getAuthToken(), main_1.latestVersion, p.name);
        _response.write(JSON.stringify(c.client.joinToWorld(world)));
    }
}
exports.getIP = getIP;
