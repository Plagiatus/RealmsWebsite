import { Client } from "minecraft-realms";
import { Player, Auth } from "./auth";
import * as Http from "http";
import * as Request from "request-promise-native/";
import * as Url from "url";
import { GetRequest } from "./get/GetRequests";
import { PostRequest } from "./post/PostRequest";

let port: string = process.env.PORT;
if (!port) {
  port = "8100";
}


export let latestVersion: string = "1.15";
getLatestVersion();
let server: Http.Server = Http.createServer();
server.addListener("request", handleRequest);
server.listen(port);

export let auth: Auth = new Auth();
let postRequests: PostRequest = new PostRequest();
let get: GetRequest = new GetRequest();

async function getLatestVersion() {
  try {
    latestVersion = JSON.parse(await Request("https://launchermeta.mojang.com/mc/game/version_manifest.json")).latest.release;
  } catch (error) {
    console.log("Couldn't reach Mojang's servers. Does our internet work? Keeping latest version on", latestVersion);
  }
  setTimeout(getLatestVersion, 1000 * 60 * 60);
}

async function handleRequest(_request: Http.IncomingMessage, _response: Http.OutgoingMessage) {
  _response.setHeader("content-type", "application/json ; charset=utf-8");
  _response.setHeader("Access-Control-Allow-Origin", "*");
  if (_request.method == "POST") {
    let body = "";
    _request.on("data", data => {
      body += data;
    });
    _request.on("end", async () => {
      let post: any = JSON.parse(body);
      // console.log("POST", post);
      if (post.command && postRequests.has(post.command)) {
        try {
          await postRequests.get(post.command)(post, _response);
        } catch (e) {
          console.log(e.message);
          _response.write(JSON.stringify({ error: e.message }))
        }
      } else {
        _response.write(JSON.stringify({ error: "Command not found." }));
      }
      _response.end();
    });
  } else if (_request.method == "GET") {
    let parsed: Url.UrlWithParsedQuery = Url.parse(_request.url, true);
    let path: string = parsed.pathname.substr(1);
    let query = parsed.query;
    if (path && get.has(path)) {

      try {
        await get.get(path)(query, _response);
      } catch (e) {
        console.log(e.message);
        _response.write(JSON.stringify({ error: e.message }))
      }
    } else {
      _response.write(JSON.stringify({ error: "Path not found" }))
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
