import { Player } from "../auth";
import * as Http from "http";
import { Client } from "minecraft-realms";
import { latestVersion } from "../main";

export async function changeInvite(_input, _response: Http.OutgoingMessage) {
  let email: string = _input.email;
  let token: string = _input.token;
  let uuid: string = _input.uuid;
  let name: string = _input.name;
  let invite: string = _input.invite;
  let accept: boolean = _input.accept;
  if (!email || !token || !uuid || !name || !invite) {
    throw new Error("Not enough parameters given.");
  } else {
    let p: Player = new Player(email, token, uuid, name);
    let c: Client = new Client(p.getAuthToken(), latestVersion, p.name);
    if (accept) {
      _response.write(JSON.stringify({response: c.client.acceptInvite(invite)}));
    }
    else {
      _response.write(JSON.stringify({response: c.client.rejectInvite(invite)}));
    }
  }
}