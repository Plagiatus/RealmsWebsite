"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const MR = require("../../realmsapi");
const main_1 = require("../main");
async function updateProperties(_input, _response) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    let name = _input.name;
    let world = Number(_input.world);
    let worldName = _input.worldName;
    let worldDescription = _input.worldDescription;
    if (!email || !token || !uuid || !name || !world || !worldName || !worldDescription) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email, token, uuid, name);
        let c = new MR.Client(p.getAuthToken(), main_1.latestVersion, p.name);
        let d = new MR.RealmsDescriptionDto(worldName, worldDescription, c.worlds.getWorld(world));
        c.client.setDescription(d);
        _response.write("no reply");
    }
}
exports.updateProperties = updateProperties;
