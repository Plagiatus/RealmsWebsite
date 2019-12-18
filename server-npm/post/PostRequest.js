"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("./login");
const authenticate_1 = require("./authenticate");
const getWorlds_1 = require("./getWorlds");
const invalidate_1 = require("./invalidate");
class PostRequest {
    constructor() {
        this.requests = new Map();
        this.requests.set(login_1.login.name, login_1.login);
        this.requests.set(authenticate_1.authenticate.name, authenticate_1.authenticate);
        this.requests.set(getWorlds_1.getWorlds.name, getWorlds_1.getWorlds);
        this.requests.set(invalidate_1.invalidate.name, invalidate_1.invalidate);
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
