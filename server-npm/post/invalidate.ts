import { Player } from "../auth";
import * as Http from "http";
import { auth } from "../main";

export async function invalidate(_input, _response: Http.OutgoingMessage){
  let token: string = _input.token;
  if(!token) {
    throw new Error("Not enough parameters given.");
  } else {
    let p: Player = new Player("", token, "");
    auth.invalidate(p);
    _response.write(JSON.stringify({result: "ok"}));
  }
}