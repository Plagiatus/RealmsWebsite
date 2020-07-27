"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./auth");
const Http = require("http");
const Request = require("request-promise-native/");
const Url = require("url");
const GetRequests_1 = require("./get/GetRequests");
const PostRequest_1 = require("./post/PostRequest");
let port = process.env.PORT;
if (!port) {
    port = "8100";
}
exports.latestVersion = "1.16.1";
getLatestVersion();
let server = Http.createServer();
server.addListener("request", handleRequest);
server.listen(port);
exports.auth = new auth_1.Auth();
let postRequests = new PostRequest_1.PostRequest();
let get = new GetRequests_1.GetRequest();
async function getLatestVersion() {
    try {
        exports.latestVersion = JSON.parse(await Request("https://launchermeta.mojang.com/mc/game/version_manifest.json")).latest.release;
    }
    catch (error) {
        console.log("Couldn't reach Mojang's servers. Does our internet work? Keeping latest version on", exports.latestVersion);
    }
    setTimeout(getLatestVersion, 1000 * 60 * 60);
}
async function handleRequest(_request, _response) {
    _response.setHeader("content-type", "application/json ; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");
    if (_request.method == "POST") {
        let body = "";
        _request.on("data", data => {
            body += data;
        });
        _request.on("end", async () => {
            let post;
            try {
                post = JSON.parse(body);
            }
            catch (e) {
                _response.write(JSON.stringify({ error: "Failed to parse post request." }));
            }
            if (post && post.command && postRequests.has(post.command)) {
                try {
                    await postRequests.get(post.command)(post, _response);
                }
                catch (e) {
                    console.log(e.message);
                    _response.write(JSON.stringify({ error: e.message }));
                }
            }
            else {
                _response.write(JSON.stringify({ error: "Command not found." }));
            }
            _response.end();
        });
    }
    else if (_request.method == "GET") {
        let parsed = Url.parse(_request.url, true);
        let path = parsed.pathname.substr(1);
        let query = parsed.query;
        if (path && get.has(path)) {
            try {
                await get.get(path)(query, _response);
            }
            catch (e) {
                console.log(e.message);
                _response.write(JSON.stringify({ error: e.message }));
            }
        }
        else {
            _response.write(JSON.stringify({ error: "Path not found" }));
        }
        _response.end();
    }
    else {
        _response.write(JSON.stringify({ error: "You shouldn't be sending me this request." }));
        _response.end();
    }
}
function mapToObj(_map) {
    let newMap = {};
    for (let e of _map.keys()) {
        newMap[e] = _map.get(e);
    }
    return newMap;
}
exports.mapToObj = mapToObj;
