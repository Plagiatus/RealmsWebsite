"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("./login");
const authenticate_1 = require("./authenticate");
const getWorlds_1 = require("./getWorlds");
const invalidate_1 = require("./invalidate");
const getPlayers_1 = require("./getPlayers");
const toggleOP_1 = require("./toggleOP");
const invite_1 = require("./invite");
const detail_1 = require("./detail");
const kick_1 = require("./kick");
const open_1 = require("./open");
const close_1 = require("./close");
const updateProperties_1 = require("./updateProperties");
const changeSlot_1 = require("./changeSlot");
const templates_1 = require("./templates");
const setMinigame_1 = require("./setMinigame");
const worldSettings_1 = require("./worldSettings");
const setTemplate_1 = require("./setTemplate");
const resetWorld_1 = require("./resetWorld");
class PostRequest {
    constructor() {
        this.requests = new Map();
        this.requests.set(login_1.login.name, login_1.login);
        this.requests.set(authenticate_1.authenticate.name, authenticate_1.authenticate);
        this.requests.set(getWorlds_1.getWorlds.name, getWorlds_1.getWorlds);
        this.requests.set(invalidate_1.invalidate.name, invalidate_1.invalidate);
        this.requests.set(getPlayers_1.getPlayers.name, getPlayers_1.getPlayers);
        this.requests.set(toggleOP_1.toggleOP.name, toggleOP_1.toggleOP);
        this.requests.set(invite_1.invite.name, invite_1.invite);
        this.requests.set(detail_1.detail.name, detail_1.detail);
        this.requests.set(kick_1.kick.name, kick_1.kick);
        this.requests.set(open_1.open.name, open_1.open);
        this.requests.set(close_1.close.name, close_1.close);
        this.requests.set(updateProperties_1.updateProperties.name, updateProperties_1.updateProperties);
        this.requests.set(changeSlot_1.changeSlot.name, changeSlot_1.changeSlot);
        this.requests.set(templates_1.templates.name, templates_1.templates);
        this.requests.set(setMinigame_1.setMinigame.name, setMinigame_1.setMinigame);
        this.requests.set(worldSettings_1.worldSettings.name, worldSettings_1.worldSettings);
        this.requests.set(setTemplate_1.setTemplate.name, setTemplate_1.setTemplate);
        this.requests.set(resetWorld_1.resetWorld.name, resetWorld_1.resetWorld);
    }
    get(name) {
        if (!this.requests.has(name)) {
            throw new Error("Request cannot be processed: Command not found.");
        }
        return this.requests.get(name);
    }
    has(name) {
        return this.requests.has(name);
    }
}
exports.PostRequest = PostRequest;
