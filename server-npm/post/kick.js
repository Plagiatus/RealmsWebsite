"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const minecraft_realms_1 = require("minecraft-realms");
const main_1 = require("../main");
async function kick(_input, _response) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    let name = _input.name;
    let world = Number(_input.world);
    let playeruuid = _input.playeruuid;
    if (!email || !token || !uuid || !name || !world || !playeruuid) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email, token, uuid, name);
        let c = new minecraft_realms_1.Client(p.getAuthToken(), main_1.latestVersion, p.name);
        // console.log(c.worlds);
        _response.write(JSON.stringify(c.worlds.getWorld(world).detailInformation().getPlayerByUUID(playeruuid).kickPlayer()));
    }
}
exports.kick = kick;
