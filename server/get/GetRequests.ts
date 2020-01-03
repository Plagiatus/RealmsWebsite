import { skin } from "./skin";
import { ping } from "./ping";

export class GetRequest {
  requests: Map<string, Function> = new Map<string, Function>();
  constructor(){
    this.requests.set(skin.name, skin);
    this.requests.set(ping.name, ping);
  }
  
  get(name: string): Function {
    if (!this.requests.has(name)) {
      throw new Error("Request cannot be processed: Path not found.")
    }
    return this.requests.get(name);
  }
  
  has(name: string): boolean {
    return this.requests.has(name);
  }
}