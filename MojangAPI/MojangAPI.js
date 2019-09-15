"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request = require("request-promise-native/");
class API {
    static async getStatus() {
        if (this.status.length <= 0) {
            this.status = JSON.parse(await Request("https://status.mojang.com/check"));
        }
        return this.status;
    }
    ;
    static async getUUIDFromName(_name) {
        return JSON.parse(await Request("https://api.mojang.com/users/profiles/minecraft/" + _name)).id;
    }
    static async getNamesFromUUID(_uuid) {
        return JSON.parse(await Request("https://api.mojang.com/user/profiles/" + _uuid + "/names"));
    }
}
API.status = [];
exports.API = API;
// }
