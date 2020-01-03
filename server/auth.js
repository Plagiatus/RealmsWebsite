"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request = require("request-promise-native/");
class Auth {
    constructor() {
        this.baseUrl = "https://authserver.mojang.com";
        this.authenticateUrl = "/authenticate";
        this.refreshUrl = "/refresh";
        this.validateUrl = "/validate";
        this.invalidateUrl = "/invalidate";
    }
    // signoutUrl: string = "/signout";
    async validate(_p) {
        try {
            await Request(await _p.postTokensOnlyConfig(this.baseUrl + this.validateUrl));
        }
        catch (_e) {
            console.error("Error validating. Attempting to refresh...");
            try {
                await this.refreshToken(_p);
            }
            catch (error) {
                console.error("Error refreshing token. Please authenticate instead.");
                throw (new Error("Error refreshing token. Please log in again."));
            }
        }
    }
    async authenticate(_p, _password) {
        try {
            let some = await Request(await _p.postAuthenticationConfig(this.baseUrl + this.authenticateUrl, _password));
            _p.token = some.accessToken;
            _p.name = some.selectedProfile.name;
            _p.uuid = some.selectedProfile.id;
        }
        catch (error) {
            console.error("Authentication Error:", error.message);
            throw error;
        }
    }
    async refreshToken(_p) {
        try {
            let some = await Request(await _p.postTokensOnlyConfig(this.baseUrl + this.refreshUrl));
            _p.token = some.accessToken;
        }
        catch (error) {
            console.error("Refresh Error:", error.message);
            throw error;
        }
    }
    async invalidate(_p) {
        try {
            let some = await Request(await _p.postTokensOnlyConfig(this.baseUrl + this.invalidateUrl));
        }
        catch (error) {
            console.error("Invalidate Error:", error.message);
            throw (error);
        }
    }
}
exports.Auth = Auth;
class Player {
    constructor(_email, _token = "", _uuid = "", _name = "") {
        this.email = _email;
        this.uuid = _uuid;
        this.token = _token;
        this.name = _name;
    }
    getAuthToken() {
        return "token:" + this.token + ":" + this.uuid;
    }
    async postAuthenticationConfig(_url, _password) {
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
                password: _password,
                clientToken: "058d62d539b34158a3fb2023d524be22",
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
                accessToken: this.token,
                clientToken: "058d62d539b34158a3fb2023d524be22",
            },
            json: true
        };
    }
}
exports.Player = Player;
