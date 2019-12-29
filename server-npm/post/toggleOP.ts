import { Player } from "../auth";
import * as Http from "http";
import { Client, PlayerInfo } from "minecraft-realms";
import { latestVersion } from "../main";

export async function toggleOP(_input, _response: Http.OutgoingMessage) {
  let email: string = _input.email;
  let token: string = _input.token;
  let uuid: string = _input.uuid;
  let name: string = _input.name;
  let world: number = Number(_input.world);
  let playeruuid: string = _input.playeruuid;
  let toggle: boolean = _input.toggle;
  if (!email || !token || !uuid || !name || !world || !playeruuid) {
    throw new Error("Not enough parameters given.");
  } else {
    let p: Player = new Player(email, token, uuid, name);
    let c: Client = new Client(p.getAuthToken(), latestVersion, p.name);
    // console.log(c.worlds);
    let pi: PlayerInfo = c.worlds.getWorld(world).detailInformation().getPlayerByUUID(playeruuid);
    if(toggle) {
      _response.write(JSON.stringify(pi.makeOp()));
    } else {
    _response.write(JSON.stringify(pi.deopPlayer()));
    }
  }
}