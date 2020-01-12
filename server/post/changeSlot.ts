import { Player } from "../auth";
import * as Http from "http";
import { latestVersion } from "../main";
import { Client, SlotNumber } from "minecraft-realms";

export async function changeSlot(_input, _response: Http.OutgoingMessage) {
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
    let rs: any = c.worlds.getWorld(world).detailInformation().changeSlot(<SlotNumber>slot);
    rs.slots = Array.from(rs.slots);
    _response.write(JSON.stringify(rs));
  }
}