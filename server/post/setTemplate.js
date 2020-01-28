"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const MR = require("../../realmsapi");
const main_1 = require("../main");
async function setTemplate(_input, _response) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    let name = _input.name;
    let world = Number(_input.world);
    let id = Number(_input.id);
    if (!email || !token || !uuid || !name || !world || !id) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email, token, uuid, name);
        let c = new MR.Client(p.getAuthToken(), main_1.latestVersion, p.name);
        let wrd = new MR.RealmsWorldResetDto(null, id, -1, false);
        _response.write(JSON.stringify({ reply: c.client.resetWorld(world, wrd) }));
    }
}
exports.setTemplate = setTemplate;
