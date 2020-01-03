import { login } from "./login";
import { authenticate } from "./authenticate";
import { getWorlds } from "./getWorlds";
import { invalidate } from "./invalidate";
import { getPlayers } from "./getPlayers";
import { toggleOP } from "./toggleOP";
import { invite } from "./invite";
import { detail } from "./detail";
import { kick } from "./kick";
import { open } from "./open";
import { close } from "./close";
import { updateProperties } from "./updateProperties";

export class PostRequest {
  requests: Map<string, Function> = new Map<string, Function>();
  constructor(){
    this.requests.set(login.name, login);
    this.requests.set(authenticate.name, authenticate);
    this.requests.set(getWorlds.name, getWorlds);
    this.requests.set(invalidate.name, invalidate);
    this.requests.set(getPlayers.name, getPlayers);
    this.requests.set(toggleOP.name, toggleOP);
    this.requests.set(invite.name, invite);
    this.requests.set(detail.name, detail);
    this.requests.set(kick.name, kick);
    this.requests.set(open.name, open);
    this.requests.set(close.name, close);
    this.requests.set(updateProperties.name, updateProperties);
  }
  
  get(name: string): Function {
    if (!this.requests.has(name)) {
      throw new Error("Request cannot be processed: Command not found.")
    }
    return this.requests.get(name);
  }

  has(name: string): boolean {
    return this.requests.has(name);
  }
}