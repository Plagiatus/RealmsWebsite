import { Client, SlotNumber } from "minecraft-realms";
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


export let latestVersion: string = "1.16.1";
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

      let post: any;
      try {
        post = JSON.parse(body);
      } catch (e) {
        _response.write(JSON.stringify({ error: "Failed to parse post request." }));
      }

      if (post && post.command && postRequests.has(post.command)) {
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
    _response.write(JSON.stringify({ error: "You shouldn't be sending me this request." }));
    _response.end();
  }
}

export function mapToObj(_map) {
  let newMap = {};
  for (let e of _map.keys()) {
    newMap[e] = _map.get(e);
  }
  return newMap;
}