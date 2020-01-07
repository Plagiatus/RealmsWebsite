"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ping_1 = require("./ping");
class GetRequest {
    constructor() {
        this.requests = new Map();
        //this.requests.set(skin.name, skin);
        this.requests.set(ping_1.ping.name, ping_1.ping);
    }
    get(name) {
        if (!this.requests.has(name)) {
            throw new Error("Request cannot be processed: Path not found.");
        }
        return this.requests.get(name);
    }
    has(name) {
        return this.requests.has(name);
    }
}
exports.GetRequest = GetRequest;
