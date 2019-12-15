export class PostRequest {
  requests: Map<string, Function> = new Map<string, Function>();
  constructor(){
    // this.requests.set(skin.name, skin);
  }
  
  get(name: string): Function {
    if (!this.requests.has(name)) {
      throw new Error("Request cannot be processed: Command not found.")
    }
    return this.requests.get(name);
  }
}