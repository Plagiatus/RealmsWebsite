import { Player } from "../auth";
import * as Http from "http";
import { auth } from "../main";

export async function authenticate(_input, _response: Http.OutgoingMessage) {
  let email: string = _input.email;
  let pw: string = _input.password;
  if (!email || !pw) {
    throw new Error("Not enough parameters given.");
  } else {
    let p: Player = new Player(email);
    await auth.authenticate(p, pw);
    _response.write(JSON.stringify(p));
  }
}