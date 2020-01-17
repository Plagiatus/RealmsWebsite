"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as MR from "../../realmsapi";
const main_1 = require("../main");
const Request = require("../../realmsapi/src/Client/Request.js");
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
        let r = new Request(token, uuid, main_1.latestVersion, name);
        r.post("/worlds/" + world + "/slot/" + slot, newSettings);
        _response.write(JSON.stringify({ result: "success" }));
    }
}
exports.worldSettings = worldSettings;
