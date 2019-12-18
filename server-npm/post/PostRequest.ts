import { login } from "./login";
import { authenticate } from "./authenticate";
import { getWorlds } from "./getWorlds";
import { invalidate } from "./invalidate";

export class PostRequest {
  requests: Map<string, Function> = new Map<string, Function>();
  constructor(){
    this.requests.set(login.name, login);
    this.requests.set(authenticate.name, authenticate);
    this.requests.set(getWorlds.name, getWorlds);
    this.requests.set(invalidate.name, invalidate);
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