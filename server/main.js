"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const Player_1 = require("../MojangAPI/Player");
const Realm_1 = require("../MojangAPI/Realm");
const MojangAPI_1 = require("../MojangAPI/MojangAPI");
var RealmPageServer;
(function (RealmPageServer) {
    let port = process.env.PORT;
    if (!port) {
        port = "8100";
    }
    let server = Http.createServer();
    server.addListener("request", handleRequest);
    server.listen(port);
    function handleRequest(_request, _response) {
        if (_request.method == "POST") {
            let body = "";
            _request.on("data", data => {
                body += data;
            });
            _request.on("end", async () => {
                _response.setHeader("content-type", " ; charset=utf-8");
                _response.setHeader("Access-Control-Allow-Origin", "*");
                let post = JSON.parse(body);
                let p = new Player_1.Player();
                p.name = post.username;
                p.accessToken = post.token;
                p.password = post.password;
                p.email = post.email;
                p.uuid = post.uuid;
                let r = new Realm_1.Realm(p);
                r.id = post.worldID;
                let result;
                switch (post.command) {
                    case "loginWithPW":
                        result = await to(p.authenticate());
                        if (result[0]) {
                            _response.write(createErrorString(result[0].message));
                            break;
                        }
                        _response.write(JSON.stringify(p));
                        break;
                    case "loginWithToken":
                        result = await to(p.validate());
                        if (result[0]) {
                            _response.write(createErrorString(result[0].message));
                            break;
                        }
                        _response.write(JSON.stringify(p));
                        break;
                    case "getOwnedRealms":
                        result = await to(p.getOwnedRealms());
                        if (result[0]) {
                            _response.write(createErrorString(result[0].message));
                            break;
                        }
                        _response.write(JSON.stringify(result[1]));
                        break;
                    case "removePlayer":
                        result = await to(r.removePlayer(post.playerUUID));
                        break;
                    case "invitePlayer":
                        result = await to(r.invitePlayer(post.playerName));
                        if (result[0]) {
                            _response.write(createErrorString(result[0].message));
                            break;
                        }
                        _response.write(JSON.stringify(result[1]));
                        break;
                    case "opPlayer":
                        result = await to(r.opPlayer(post.playerUUID));
                        if (result[0]) {
                            _response.write(createErrorString(result[0].message));
                            break;
                        }
                        _response.write(JSON.stringify(result[1]));
                        break;
                    case "deopPlayer":
                        result = await to(r.deopPlayer(post.playerUUID));
                        break;
                    case "getUUID":
                        result = await to(MojangAPI_1.API.getUUIDFromName(post.playerName));
                        if (result[0]) {
                            _response.write(createErrorString(result[0].message));
                            break;
                        }
                        _response.write(JSON.stringify(result[1]));
                        break;
                    default:
                        _response.write(createErrorString("No/wrong command provided"));
                }
                if (result[0]) {
                    _response.write(createErrorString(result[0].message));
                }
                _response.end();
            });
        }
    }
    function createErrorString(_message) {
        console.log(_message);
        return JSON.stringify({ error: _message });
    }
    function to(_promise) {
        let result = [null, null];
        // @ts-ignore
        result = _promise.then(data => [null, data])
            .catch(err => [err, null]);
        // @ts-ignore
        return result;
    }
})(RealmPageServer || (RealmPageServer = {}));
