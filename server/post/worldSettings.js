"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const MR = require("../../realmsapi");
const main_1 = require("../main");
async function worldSettings(_input, _response) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    let name = _input.name;
    let newSettings = _input.newSettings;
    let world = Number(_input.world);
    let slot = Number(_input.slot);
    if (!email || !token || !uuid || !name || !world || !slot || !newSettings) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email, token, uuid, name);
        let c = new MR.Client(p.getAuthToken(), main_1.latestVersion, p.name);
        let rwo = MR.RealmsWorldOptions.parse(newSettings);
        //TODO do something here now
        _response.write(JSON.stringify({ result: "success" }));
    }
}
exports.worldSettings = worldSettings;
