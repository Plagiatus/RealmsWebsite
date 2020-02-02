import { Player } from "../auth";
import * as Http from "http";
import * as MR from "../../realmsapi";
import { latestVersion } from "../main";

export async function resetWorld(_input, _response: Http.OutgoingMessage) {
  let email: string = _input.email;
  let token: string = _input.token;
  let uuid: string = _input.uuid;
  let name: string = _input.name;
  let world: number = Number(_input.world);
  let slotid: number = Number(_input.slot);
  let seed: string = _input.seed;
  let levelType: string = _input.levelType;
  let genStruct: boolean = _input.genStruct;
  if (!email || !token || !uuid || !name || !world || !slotid || !seed || !levelType) {
    throw new Error("Not enough parameters given.");
  } else {
    let p: Player = new Player(email, token, uuid, name);
    let c: MR.Client = new MR.Client(p.getAuthToken(), latestVersion, p.name);
    _response.write(JSON.stringify({reply: c.client.resetWorld(world, new MR.RealmsWorldResetDto(seed, -1, levelType, genStruct))}));
  }
}