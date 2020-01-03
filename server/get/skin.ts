import * as Http from "http";
import * as Request from "request-promise-native/";

interface Skin {
  timestamp: number;
  url: string;
}

let skins: Map<string, Skin> = new Map<string, Skin>();
export async function skin(_input, _response: Http.OutgoingMessage) {
  let uuid: string = _input.uuid;
  if (!uuid) {
    throw new Error("Not enough parameters given.");
  }
  if (skins.has(uuid)) {
    let skin = skins.get(uuid);
    if (Date.now() - skin.timestamp < 86400000) { //24 hours = 86400 seconds
      _response.write(JSON.stringify({skinurl: skin.url}));
      return;
    }
  }
  let texture = JSON.parse(await Request("https://sessionserver.mojang.com/session/minecraft/profile/" + uuid)).properties[0].value;
  let parsed = JSON.parse(Buffer.from(texture, "base64").toString());
  skins.set(uuid, { url: parsed.textures.SKIN.url, timestamp: parsed.timestamp });
  _response.write(JSON.stringify({skinurl: parsed.textures.SKIN.url}));
}