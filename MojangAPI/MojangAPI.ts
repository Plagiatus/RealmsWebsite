import * as Request from "request-promise-native/";
import { Name } from "./Player";
// import * as urls from "./apiurls.json"

// export namespace MojangAPI {
  export interface Status {
    [name: string]: "green" | "yellow" | "red";
  }

  export class API {

    private static status: Status[] = [];

    static async getStatus(): Promise<Status[]> {
      if (this.status.length <= 0) {
        this.status = <Status[]>JSON.parse(await Request("https://status.mojang.com/check"));
      }
      return this.status;
    };
    static async getUUIDFromName(_name: string): Promise<string> {
      return JSON.parse(await Request("https://api.mojang.com/users/profiles/minecraft/" + _name)).id;
    }
    static async getNamesFromUUID(_uuid: string): Promise<Name[]> {
      return <Name[]> JSON.parse(await Request("https://api.mojang.com/user/profiles/" + _uuid + "/names"));
    }
  }
// }