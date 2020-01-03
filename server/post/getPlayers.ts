import { Player } from "../auth";
import * as Http from "http";
import { Client } from "minecraft-realms";
import { latestVersion } from "../main";

export async function getPlayers(_input, _response: Http.OutgoingMessage) {
  let email: string = _input.email;
  let token: string = _input.token;
  let uuid: string = _input.uuid;
  let name: string = _input.name;
  let world: number = Number(_input.world);
  if (!email || !token || !uuid || !name || !world) {
    throw new Error("Not enough parameters given.");
  } else {
    let p: Player = new Player(email, token, uuid, name);
    let c: Client = new Client(p.getAuthToken(), latestVersion, p.name);
    // console.log(c.worlds);
    _response.write(JSON.stringify(c.worlds.getWorld(world).detailInformation().players));
  }
}