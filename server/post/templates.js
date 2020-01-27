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
let lastCheck = new Map();
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
    if (!lastCheck.has(TEMPLATES[type]) || lastCheck.get(TEMPLATES[type]) + 1000 * 60 * 60 < Date.now()) {
        let p = new auth_1.Player(email, token, uuid, name);
        let c = new minecraft_realms_1.Client(p.getAuthToken(), main_1.latestVersion, p.name);
        let total = c.templates(TEMPLATES[type], 0, 1).total;
        templateMap.set(TEMPLATES[type], c.templates(TEMPLATES[type], 0, total).templates);
        lastCheck.set(TEMPLATES[type], Date.now());
    }
    if (templateMap.has(TEMPLATES[type])) {
        _response.write(JSON.stringify(templateMap.get(TEMPLATES[type])));
    }
    else {
        _response.write("[]");
    }
}
exports.templates = templates;
