import { Player } from "../auth";
import * as Http from "http";
import { Client, RealmsServer } from "minecraft-realms";
import { latestVersion, mapToObj } from "../main";

export async function downloadBackup(_input, _response: Http.OutgoingMessage) {
  let email: string = _input.email;
  let token: string = _input.token;
  let uuid: string = _input.uuid;
  let name: string = _input.name;
  let world: number = Number(_input.world);
  let slot: number = Number(_input.slot);
  if (!email || !token || !uuid || !name || !world || !slot ) {
    throw new Error("Not enough parameters given.");
  } else {
    let p: Player = new Player(email, token, uuid, name);
    let c: Client = new Client(p.getAuthToken(), latestVersion, p.name);
    _response.write(JSON.stringify(c.client.download(world, slot)));
  }
}