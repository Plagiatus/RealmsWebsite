"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const MR = require("../../realmsapi");
const main_1 = require("../main");
async function resetWorld(_input, _response) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    let name = _input.name;
    let world = Number(_input.world);
    let slotid = Number(_input.slot);
    let seed = _input.seed;
    let levelType = _input.levelType;
    let genStruct = _input.genStruct;
    if (!email || !token || !uuid || !name || !world || !slotid || !seed || !levelType) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email, token, uuid, name);
        let c = new MR.Client(p.getAuthToken(), main_1.latestVersion, p.name);
        _response.write(JSON.stringify({ reply: c.client.resetWorld(world, new MR.RealmsWorldResetDto(seed, -1, levelType, genStruct)) }));
    }
}
exports.resetWorld = resetWorld;
