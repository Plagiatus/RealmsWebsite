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
let lastCheck: Map<string, number> = new Map<string, number>();
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
  if (!lastCheck.has(TEMPLATES[type]) || lastCheck.get(TEMPLATES[type]) + 1000 * 60 * 60 < Date.now()) {
    let p: Player = new Player(email, token, uuid, name);
    let c: Client = new Client(p.getAuthToken(), latestVersion, p.name);
    let total: number = c.templates(TEMPLATES[type], 0, 1).total;
    templateMap.set(TEMPLATES[type], c.templates(TEMPLATES[type], 0, total).templates);
    lastCheck.set(TEMPLATES[type], Date.now());
  }
  if (templateMap.has(TEMPLATES[type])) {
    _response.write(JSON.stringify(templateMap.get(TEMPLATES[type])));
  } else {
    _response.write("[]");
  }
}