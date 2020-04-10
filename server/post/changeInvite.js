"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const minecraft_realms_1 = require("minecraft-realms");
const main_1 = require("../main");
async function changeInvite(_input, _response) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    let name = _input.name;
    let invite = _input.invite;
    let accept = _input.accept;
    if (!email || !token || !uuid || !name || !invite) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email, token, uuid, name);
        let c = new minecraft_realms_1.Client(p.getAuthToken(), main_1.latestVersion, p.name);
        if (accept) {
            _response.write(JSON.stringify({ response: c.client.acceptInvite(invite) }));
        }
        else {
            _response.write(JSON.stringify({ response: c.client.rejectInvite(invite) }));
        }
    }
}
exports.changeInvite = changeInvite;
