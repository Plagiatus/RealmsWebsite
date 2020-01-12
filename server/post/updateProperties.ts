import { Player } from "../auth";
import * as Http from "http";
import * as MR from "../../realmsapi";
import { latestVersion } from "../main";

export async function updateProperties(_input, _response: Http.OutgoingMessage) {
  let email: string = _input.email;
  let token: string = _input.token;
  let uuid: string = _input.uuid;
  let name: string = _input.name;
  let world: number = Number(_input.world);
  let worldName: string = _input.worldName;
  let worldDescription: string = _input.worldDescription;
  if (!email || !token || !uuid || !name || !world || !worldName || !worldDescription) {
    throw new Error("Not enough parameters given.");
  } else {
    let p: Player = new Player(email, token, uuid, name);
    let c: MR.Client = new MR.Client(p.getAuthToken(), latestVersion, p.name);
    let d: MR.RealmsDescriptionDto = new MR.RealmsDescriptionDto(worldName, worldDescription, c.worlds.getWorld(world));
    c.client.setDescription(d);
    _response.write(JSON.stringify({reply: "none"}));
  }
}