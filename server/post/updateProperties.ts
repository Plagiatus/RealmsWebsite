import { Player } from "../auth";
import * as Http from "http";
import { Client, RealmsServer, RealmsDescriptionDto } from "minecraft-realms";
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
    let c: Client = new Client(p.getAuthToken(), latestVersion, p.name);
    // let d: RealmsDescriptionDto = new RealmsDescriptionDto(worldName, worldDescription, c.worlds.getWorld(world));
    // let rs: RealmsServer = ;
    // (<any>rs.slots) = Array.from(rs.slots);
    c.client.setDesctiption({name: worldName, description: worldDescription, world: {id: world}});
    _response.write("no reply");
  }
}