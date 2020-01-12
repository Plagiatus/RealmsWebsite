"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const main_1 = require("../main");
const minecraft_realms_1 = require("minecraft-realms");
var TEMPLATES;
(function (TEMPLATES) {
    TEMPLATES["ADVENTURES"] = "ADVENTUREMAP";
    TEMPLATES["WORLD_TEMPLATES"] = "NORMAL";
    TEMPLATES["MINIGAMES"] = "MINIGAME";
    TEMPLATES["EXPERIENCES"] = "EXPERIENCE";
    TEMPLATES["INSPIRATION"] = "INSPIRATION";
})(TEMPLATES = exports.TEMPLATES || (exports.TEMPLATES = {}));
let templateMap = new Map();
let lastCheck = 0;
async function templates(_input, _response) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    let name = _input.name;
    let type = _input.type;
    if (!email || !token || !uuid || !name || !type) {
        throw new Error("Not enough parameters given.");
    }
    if (!TEMPLATES[type]) {
        throw new Error("This type of WorldTemplate doesn't exist.");
    }
    if (lastCheck + 1000 * 60 * 60 < Date.now()) {
        let p = new auth_1.Player(email, token, uuid, name);
        let c = new minecraft_realms_1.Client(p.getAuthToken(), main_1.latestVersion, p.name);
        for (let t in TEMPLATES) {
            let total = c.templates(TEMPLATES[t], 0, 1).total;
            templateMap.set(TEMPLATES[t], c.templates(TEMPLATES[t], 0, total).templates);
        }
        lastCheck = Date.now();
    }
    if (templateMap.has(TEMPLATES[type])) {
        _response.write(JSON.stringify(templateMap.get(TEMPLATES[type])));
    }
    else {
        _response.write("[]");
    }
}
exports.templates = templates;
