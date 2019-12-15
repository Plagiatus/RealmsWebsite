"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minecraft_realms_1 = require("minecraft-realms");
const auth_1 = require("./auth");
const Http = require("http");
const Url = require("url");
const GetRequests_1 = require("./get/GetRequests");
let port = process.env.PORT;
if (!port) {
    port = "8100";
}
let server = Http.createServer();
server.addListener("request", handleRequest);
server.listen(port);
let auth = new auth_1.Auth();
let postRequests = new Map();
let get = new GetRequests_1.GetRequest();
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
        try {
            await get.get(path)(query, _response);
        }
        catch (e) {
            console.log(e.message);
            _response.write(JSON.stringify({ error: e.message }));
        }
        _response.end();
    }
    else {
        _response.write(JSON.stringify({ error: "You shouldn't be sending me this requests" }));
        _response.end();
    }
}
async function authenticate(_input, _response) {
    let email = _input.email;
    let pw = _input.password;
    if (!email || !pw) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email);
        await auth.authenticate(p, pw);
        _response.write(JSON.stringify(p));
        console.log(p);
    }
}
postRequests.set(authenticate.name, authenticate);
async function login(_input, _response) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    if (!email || !token || !uuid) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email, token, uuid);
        await auth.validate(p);
        _response.write(JSON.stringify(p));
    }
}
postRequests.set(login.name, login);
async function getWorlds(_input, _response) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    let name = _input.name;
    if (!email || !token || !uuid || !name) {
        throw new Error("Not enough parameters given.");
    }
    else {
        let p = new auth_1.Player(email, token, uuid, name);
        let c = new minecraft_realms_1.Client(p.getAuthToken(), "1.15", p.name);
        // console.log(c.worlds);
        _response.write(JSON.stringify(c.worlds));
    }
}
postRequests.set(getWorlds.name, getWorlds);
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
