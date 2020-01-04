"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const realmsapi_1 = require("../../realmsapi");
const main_1 = require("../main");
async function invite(_input, _response) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    let name = _input.name;
    let world = Number(_input.world);
    let playername = _input.playername;
    if (!email || !token || !uuid || !name || !world || !playername) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email, token, uuid, name);
        let c = new realmsapi_1.Client(p.getAuthToken(), main_1.latestVersion, p.name);
        _response.write(JSON.stringify(c.worlds.getWorld(world).detailInformation().invitePlayer(playername)));
    }
}
exports.invite = invite;
