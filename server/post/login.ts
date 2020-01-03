import { Player } from "../auth";
import * as Http from "http";
import { auth } from "../main";

export async function login(_input, _response: Http.OutgoingMessage) {
  let email: string = _input.email;
  let token: string = _input.token;
  let uuid: string = _input.uuid;
  if (!email || !token || !uuid) {
    throw new Error("Not enough parameters given.");
  } else {
    let p: Player = new Player(email, token, uuid);
    await auth.validate(p);
    _response.write(JSON.stringify(p));
  }
}