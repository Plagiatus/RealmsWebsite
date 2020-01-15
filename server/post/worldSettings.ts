import { Player } from "../auth";
import * as Http from "http";
import * as MR from "../../realmsapi";
import { latestVersion } from "../main";

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
    let p: Player = new Player(email, token, uuid, name);
    let c: MR.Client = new MR.Client(p.getAuthToken(), latestVersion, p.name);
    let rwo: MR.RealmsWorldOptions = MR.RealmsWorldOptions.parse(newSettings);
    //TODO do something here now
    _response.write(JSON.stringify({result: "success"}));
  }
}