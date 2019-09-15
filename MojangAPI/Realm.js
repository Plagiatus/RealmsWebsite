"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request = require("request-promise-native/");
const apiurls = require("./apiurls.json");
var TEMPLATE_TYPE;
(function (TEMPLATE_TYPE) {
    TEMPLATE_TYPE["NORMAL"] = "NORMAL";
    TEMPLATE_TYPE["MINIGAME"] = "MINIGAME";
    TEMPLATE_TYPE["ADVENTUREMAP"] = "ADVENTUREMAP";
    TEMPLATE_TYPE["EXPERIENCE"] = "EXPERIENCE";
    TEMPLATE_TYPE["INSPIRATION"] = "INSPIRATION";
})(TEMPLATE_TYPE = exports.TEMPLATE_TYPE || (exports.TEMPLATE_TYPE = {}));
class Realm {
    constructor(_player) {
        this.accessingPlayer = _player;
    }
    async get() {
        return JSON.parse(await Request(await this.accessingPlayer.getConfig(this.processURL(apiurls.baseURL.java + apiurls.get.server.get))));
    }
    async getIP() {
        try {
            let d = JSON.parse(await Request(await this.accessingPlayer.getConfig(this.processURL(apiurls.baseURL.java + apiurls.get.server.ip))));
            return d.address;
        }
        catch (error) {
            console.error(error.message);
            throw error;
        }
    }
    async getBackups() {
        let bs = JSON.parse(await Request(await this.accessingPlayer.getConfig(this.processURL(apiurls.baseURL.java + apiurls.get.server.backups)))).backups;
        return bs;
    }
    async getBackupDownload(_world) {
        let d = JSON.parse(await Request(await this.accessingPlayer.getConfig(this.processURL(apiurls.baseURL.java + apiurls.get.server.download, _world))));
        return d;
    }
    async getOPsUUIDs() {
        return JSON.parse(await Request(await this.accessingPlayer.getConfig(this.processURL(apiurls.baseURL.java + apiurls.get.server.ops)))).ops;
    }
    async getSubscription() {
        return JSON.parse(await Request(await this.accessingPlayer.getConfig(this.processURL(apiurls.baseURL.java + apiurls.get.server.subscription))));
    }
    async invitePlayer(_playerName) {
        try {
            let realm = await Request(await this.postInvitePlayer(this.processURL(apiurls.baseURL.java + apiurls.post.server.add_user), this.accessingPlayer, _playerName));
            this.players = realm.players;
            return this;
        }
        catch (error) {
            console.log(error);
        }
        return null;
    }
    async removePlayer(_uuid) {
        await Request.delete(await this.postGeneric(this.processURL(apiurls.baseURL.java + apiurls.del.server.remove_user, 1, _uuid), this.accessingPlayer));
    }
    async opPlayer(_uuid) {
        return JSON.parse(await Request.post(await this.postGeneric(this.processURL(apiurls.baseURL.java + apiurls.post.server.op_user, 1, _uuid), this.accessingPlayer))).ops;
    }
    async deopPlayer(_uuid) {
        return JSON.parse(await Request.delete(await this.postGeneric(this.processURL(apiurls.baseURL.java + apiurls.del.server.deop_user, 1, _uuid), this.accessingPlayer))).ops;
    }
    // TODO
    // async switchToSlot(_slot: number): void { }
    // async resetActiveSlot(): void { }
    // async switchToMinigame(_m: Minigame): void { }
    async close() {
        await Request.put(await this.postGeneric(this.processURL(apiurls.baseURL.java + apiurls.put.server.close), this.accessingPlayer));
        this.state = "CLOSED";
    }
    async open() {
        await Request.put(await this.postGeneric(this.processURL(apiurls.baseURL.java + apiurls.put.server.open), this.accessingPlayer));
        this.state = "OPEN";
    }
    async getTemplates(_type, _page = 1, _pageSize = 10) {
        let url = apiurls.baseURL.java + apiurls.get.template.get_templates;
        url = url.replace("$TEMPLATE", _type)
            .replace("$PAGE", _page.toString())
            .replace("$PAGE_SIZE", _pageSize.toString());
        console.log(url);
        return JSON.parse(await Request.get(await this.accessingPlayer.getConfig(url)));
    }
    processURL(_url, _world = 0, _uuid = "12345") {
        let newURL = _url.replace("$SERVER_ID", this.id.toString())
            .replace("$WORLD", _world.toString())
            .replace("$UUID", _uuid)
            .replace("", "");
        return newURL;
    }
    async postInvitePlayer(_url, _p, _name) {
        let config = {
            url: _url,
            method: "POST",
            headers: {
                "Cookie": "sid=token:" + _p.accessToken + ":" + await _p.getUUID() + ";user=" + await _p.getName() + ";version=1.14.4",
                name: "Content-Type",
                value: "application/json",
            },
            body: {
                name: _name
            },
            json: true
        };
        return config;
    }
    async postGeneric(_url, _p) {
        let config = {
            url: _url,
            headers: {
                "Cookie": "sid=token:" + _p.accessToken + ":" + await _p.getUUID() + ";user=" + await _p.getName() + ";version=1.14.4",
            }
        };
        return config;
    }
}
exports.Realm = Realm;
// }
