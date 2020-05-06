"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const minecraft_realms_1 = require("minecraft-realms");
const main_1 = require("../main");
async function downloadBackup(_input, _response) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    let name = _input.name;
    let world = Number(_input.world);
    let slot = Number(_input.slot);
    if (!email || !token || !uuid || !name || !world || !slot) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email, token, uuid, name);
        let c = new minecraft_realms_1.Client(p.getAuthToken(), main_1.latestVersion, p.name);
        _response.write(JSON.stringify(c.client.download(world, slot)));
    }
}
exports.downloadBackup = downloadBackup;
