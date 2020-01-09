import * as Http from "http";
import * as Request from "request-promise-native/";

export async function playerUUID(_input, _response: Http.OutgoingMessage) {
  let name: string = _input.name;
  if (!name) {
    throw new Error("Not enough parameters given.");
  }
  _response.write(await Request("https://api.mojang.com/users/profiles/minecraft/" + name));
}