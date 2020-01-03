"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const minecraft_realms_1 = require("minecraft-realms");
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
        let c = new minecraft_realms_1.Client(p.getAuthToken(), main_1.latestVersion, p.name);
        // let d: RealmsDescriptionDto = new RealmsDescriptionDto(worldName, worldDescription, c.worlds.getWorld(world));
        // let rs: RealmsServer = ;
        // (<any>rs.slots) = Array.from(rs.slots);
        c.client.setDesctiption({ name: worldName, description: worldDescription, world: { id: world } });
        _response.write("no reply");
    }
}
exports.updateProperties = updateProperties;
