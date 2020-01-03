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
exports.latestVersion = "1.15";
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
            let post = JSON.parse(body);
            // console.log("POST", post);
            if (post.command && postRequests.has(post.command)) {
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
        _response.write(JSON.stringify({ error: "You shouldn't be sending me this requests" }));
        _response.end();
    }
}
// let r: Client = new Client("token:7fa6518d5bbc40c7b9370bded454c150:e75e2d263b724a93a3e7a2491f4c454f", "1.15", "Plagiatus");
// let r: Client = new Client("token:9c1b3949871441999761e0c3a12ca35b:64870cb3e3e14857bec6b9f597dc8b21", "1.15", "Plagypus");
// let id: number = 4156375;
// console.log(r.worlds.getWorld(4156375).detailInformation().sortPlayers().players[0]);
// console.log(r.invites.);
// async function test(){
//   let auth: Auth = new Auth();
//   let p: Player = new Player("therealplagiatus@gmail.com", "", "");
//   try{
//     await auth.validate(p);
//   } catch(e){
//     await auth.authenticate(p, "Scheuerle20.01.1995");
//   }
//   console.log(p);
//   await auth.validate(p);
//   let c: Client = new Client(`token:${p.token}:${p.uuid}`, "1.15", p.name);
//   console.log(c);
// }
// test();
