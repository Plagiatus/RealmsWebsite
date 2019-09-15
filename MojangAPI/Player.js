"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request = require("request-promise-native/");
const MojangAPI_1 = require("./MojangAPI");
const apiurls = require("./apiurls.json");
const Realm_1 = require("./Realm");
class Player {
    async getUUID() {
        if (!this.uuid)
            this.uuid = await MojangAPI_1.API.getUUIDFromName(this.name);
        return this.uuid;
    }
    async getName() {
        if (!this.name) {
            let names = await MojangAPI_1.API.getNamesFromUUID(this.uuid);
            this.name = names[0].name;
        }
        return this.name;
    }
    async authenticate() {
        try {
            let some = await Request(await this.postAuthenticationConfig(apiurls.baseURL.auth + apiurls.post.user.authenticate));
            this.accessToken = some.accessToken;
            this.name = some.selectedProfile.name;
            this.uuid = some.selectedProfile.id;
        }
        catch (error) {
            console.error("Authentication Error:", error.message);
            throw error;
        }
    }
    async refreshToken() {
        try {
            let some = await Request(await this.postTokensOnlyConfig(apiurls.baseURL.auth + apiurls.post.user.refresh));
            this.accessToken = some.accessToken;
        }
        catch (error) {
            console.error("Refresh Error:", error.message);
            throw error;
        }
    }
    async validate() {
        try {
            await Request(await this.postTokensOnlyConfig(apiurls.baseURL.auth + apiurls.post.user.validate));
        }
        catch (_e) {
            console.error("Error validating. Attempting to refresh...");
            try {
                await this.refreshToken();
            }
            catch (error) {
                console.error("Error refreshing token. Attempting to re-authenticate...");
                await this.authenticate();
            }
        }
    }
    async signout() {
        try {
            await Request(await this.postCredentialsOnlyConfig(apiurls.baseURL.auth + apiurls.post.user.signout));
        }
        catch (_e) {
            console.error("Signout Error:", _e.message);
        }
    }
    async invalidate() {
        try {
            await Request(await this.postTokensOnlyConfig(apiurls.baseURL.auth + apiurls.post.user.invalidate));
        }
        catch (_e) {
            console.error("Invalidate Error:", _e.message);
        }
    }
    async getNameHistory() {
        return await MojangAPI_1.API.getNamesFromUUID(this.uuid);
    }
    // TODO
    // setSkin() { }
    // resetSkin() { }
    async getRealmsInvites() {
        return JSON.parse(await Request.get(await this.getConfig(apiurls.baseURL.java + apiurls.get.user.pending_invites))).invites;
    }
    async getRealmsInvitesCount() {
        return await Request.get(await this.getConfig(apiurls.baseURL.java + apiurls.get.user.pending_invites_count));
    }
    async getAccessibleRealms() {
        let fakeRealms = JSON.parse(await Request.get(await this.getConfig(apiurls.baseURL.java + apiurls.get.user.get_servers))).servers;
        let realRealms = [];
        // console.log(fakeRealms);
        for (let fr of fakeRealms) {
            let r = new Realm_1.Realm(this);
            r = Object.assign(r, fr);
            realRealms.push(r);
            // if(fr.owner == "Plagiatus") console.log(fr);
        }
        return realRealms;
    }
    async getOwnedRealms() {
        let allRealms = await this.getAccessibleRealms();
        let ownedRealms = [];
        for (let realm of allRealms) {
            if (realm.owner == await this.getName()) {
                realm = Object.assign(realm, await realm.get());
                ownedRealms.push(realm);
            }
        }
        return ownedRealms;
    }
    async getConfig(_url) {
        let config = {
            url: _url,
            headers: {
                "Cookie": "sid=token:" + this.accessToken + ":" + await this.getUUID() + ";user=" + await this.getName() + ";version=1.14.4" //TODO: don't hardcode the version. 
            }
        };
        return config;
    }
    async postAuthenticationConfig(_url) {
        return {
            url: _url,
            method: "POST",
            headers: [{
                    name: "Content-Type",
                    value: "application/json",
                }],
            body: {
                agent: {
                    name: "Minecraft",
                    version: 1 // This number might be increased by the vanilla client in the future
                },
                username: this.email,
                password: this.password,
                clientToken: apiurls.clientToken,
            },
            json: true
        };
    }
    async postTokensOnlyConfig(_url) {
        return {
            url: _url,
            method: "POST",
            headers: [{
                    name: "Content-Type",
                    value: "application/json",
                }],
            body: {
                accessToken: this.accessToken,
                clientToken: apiurls.clientToken,
            },
            json: true
        };
    }
    async postCredentialsOnlyConfig(_url) {
        return {
            url: _url,
            method: "POST",
            headers: [{
                    name: "Content-Type",
                    value: "application/json",
                }],
            body: {
                username: this.email,
                password: this.password
            },
            json: true
        };
    }
}
exports.Player = Player;
