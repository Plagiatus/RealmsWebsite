import { Player } from "../auth";
import * as Http from "http";
// import * as MR from "../../realmsapi";
import { latestVersion } from "../main";
import * as Request from "../../realmsapi/src/Client/Request.js";

export async function worldSettings(_input, _response: Http.OutgoingMessage) {
  let email: string = _input.email;
  let token: string = _input.token;
  let uuid: string = _input.uuid;
  let name: string = _input.name;
  let newSettings: string = _input.newSettings;
  let world: number = Number(_input.world);
  let slot: number = Number(_input.slot);
  if (!email || !token || !uuid || !name || !world || !slot || !newSettings) {
    throw new Error("Not enough parameters given.");
  } else {
    let r: Request = new Request(token, uuid, latestVersion, name);
    r.post("/worlds/"+world+"/slot/"+slot, newSettings);
    _response.write(JSON.stringify({result: "success"}));
  }
}