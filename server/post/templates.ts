import { Player } from "../auth";
import * as Http from "http";
import { latestVersion } from "../main";
import { Client, WorldTemplate } from "minecraft-realms";

export enum TEMPLATES {
  ADVENTURES = "ADVENTUREMAP",
  WORLD_TEMPLATES = "NORMAL",
  MINIGAMES = "MINIGAME",
  EXPERIENCES = "EXPERIENCE",
  INSPIRATION = "INSPIRATION"
}

let templateMap: Map<string, WorldTemplate[]> = new Map<string, WorldTemplate[]>();
let lastCheck: number = 0;
export async function templates(_input, _response: Http.OutgoingMessage) {
  let email: string = _input.email;
  let token: string = _input.token;
  let uuid: string = _input.uuid;
  let name: string = _input.name;
  let type: TEMPLATES = _input.type;
  if (!email || !token || !uuid || !name || !type) {
    throw new Error("Not enough parameters given.");
  }
  if (!TEMPLATES[type]) {
    throw new Error("This type of WorldTemplate doesn't exist.");
  }
  if (lastCheck + 1000 * 60 * 60 < Date.now()) {
    let p: Player = new Player(email, token, uuid, name);
    let c: Client = new Client(p.getAuthToken(), latestVersion, p.name);
    for(let t in TEMPLATES){
      let total: number = c.templates(TEMPLATES[t],0,1).total;
      templateMap.set(TEMPLATES[t], c.templates(TEMPLATES[t], 0, total).templates);
    }
    lastCheck = Date.now();
  }
  if (templateMap.has(TEMPLATES[type])) {
    _response.write(JSON.stringify(templateMap.get(TEMPLATES[type])));
  } else {
    _response.write("[]");
  }
}