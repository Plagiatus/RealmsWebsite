import * as Http from "http";
import * as Url from "url";
import * as qs from "querystring";
import { Player } from "../MojangAPI/Player";
import { create } from "domain";
import { Realm } from "../MojangAPI/Realm";
import { API } from "../MojangAPI/MojangAPI";

namespace RealmPageServer {
  let port: string = process.env.PORT;
  if (!port) {
    port = "8100";
  }

  let server: Http.Server = Http.createServer();
  server.addListener("request", handleRequest);
  server.listen(port);

  function handleRequest(_request: Http.IncomingMessage, _response: Http.OutgoingMessage) {
    if (_request.method == "POST") {
      let body = "";
      _request.on("data", data => {
        body += data;
      });
      _request.on("end", async () => {
        _response.setHeader("content-type", " ; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        let post: any = JSON.parse(body);

        let p: Player = new Player();
        p.name = post.username;
        p.accessToken = post.token;
        p.password = post.password;
        p.email = post.email;
        p.uuid = post.uuid;
        let r: Realm = new Realm(p);
        r.id = post.worldID;

        let result: [Error, any];
        switch (post.command) {
          case "loginWithPW":
            result = await to(p.authenticate());
            if (result[0]) {
              _response.write(createErrorString(result[0].message))
              break;
            }
            _response.write(JSON.stringify(p));
            break;
          case "loginWithToken":
            result = await to(p.validate());
            if (result[0]) {
              _response.write(createErrorString(result[0].message))
              break;
            }
            _response.write(JSON.stringify(p));
            break;
          case "getOwnedRealms":
            result = await to(p.getOwnedRealms());
            if (result[0]) {
              _response.write(createErrorString(result[0].message))
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
              _response.write(createErrorString(result[0].message))
              break;
            }
            _response.write(JSON.stringify(result[1]));
            break;
          case "opPlayer":
            result = await to(r.opPlayer(post.playerUUID));
            if (result[0]) {
              _response.write(createErrorString(result[0].message))
              break;
            }
            _response.write(JSON.stringify(result[1]));
            break;
          case "deopPlayer":
            result = await to(r.deopPlayer(post.playerUUID));
            break;
          case "getUUID":
            result = await to(API.getUUIDFromName(post.playerName));
            if (result[0]) {
              _response.write(createErrorString(result[0].message))
              break;
            }
            _response.write(JSON.stringify(result[1]));
            break;
          default:
            _response.write(createErrorString("No/wrong command provided"));
        }
        if (result[0]) {
          _response.write(createErrorString(result[0].message))
        }

        _response.end();
      });
    }
  }

  function createErrorString(_message: string): string {
    console.log(_message);
    return JSON.stringify({ error: _message });
  }

  function to(_promise: Promise<any>): Promise<[Error, any]> {
    let result: [Error, any] = [null, null];
    // @ts-ignore
    result = _promise.then(data => [null, data])
      .catch(err => [err, null]);
    // @ts-ignore
    return result;
  }
}