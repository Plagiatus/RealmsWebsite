"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PostRequest {
    constructor() {
        this.requests = new Map();
        // this.requests.set(skin.name, skin);
    }
    get(name) {
        if (!this.requests.has(name)) {
            throw new Error("Request cannot be processed: Command not found.");
        }
        return this.requests.get(name);
    }
}
exports.PostRequest = PostRequest;
