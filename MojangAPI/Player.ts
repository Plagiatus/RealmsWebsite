import * as Request from "request-promise-native/";
import { API } from "./MojangAPI";
import * as apiurls from "./apiurls.json";
import { Invite, Realm } from "./Realm";

export interface Name {
  name: string;
  changedToAt: number;
}
export class Player {
  name: string;
  uuid: string;
  accessToken: string;
  email: string;
  password: string;

  async getUUID(): Promise<string> {
    if (!this.uuid)
      this.uuid = await API.getUUIDFromName(this.name);
    return this.uuid;
  }
  async getName(): Promise<string> {
    if (!this.name) {
      let names: Name[] = await API.getNamesFromUUID(this.uuid);
      this.name = names[0].name;
    }
    return this.name;
  }
  async authenticate(): Promise<void> {
    try {
      let some = await Request(await this.postAuthenticationConfig(apiurls.baseURL.auth + apiurls.post.user.authenticate));
      this.accessToken = some.accessToken;
      this.name = some.selectedProfile.name;
      this.uuid = some.selectedProfile.id;
    } catch (error) {
      console.error("Authentication Error:", error.message)
      throw error;
    }
  }
  async refreshToken(): Promise<void> {
    try {
      let some = await Request(await this.postTokensOnlyConfig(apiurls.baseURL.auth + apiurls.post.user.refresh));
      this.accessToken = some.accessToken;
    } catch (error) {
      console.error("Refresh Error:", error.message);
      throw error;
    }
  }
  async validate(): Promise<void> {
    try {
      await Request(await this.postTokensOnlyConfig(apiurls.baseURL.auth + apiurls.post.user.validate))
    } catch (_e) {
      console.error("Error validating. Attempting to refresh...");
      try {
        await this.refreshToken();
      } catch (error) {
        console.error("Error refreshing token. Attempting to re-authenticate...");
        await this.authenticate();
      }
    }
  }
  async signout(): Promise<void> { 
    try {
      await Request(await this.postCredentialsOnlyConfig(apiurls.baseURL.auth + apiurls.post.user.signout))
    } catch (_e) {
      console.error("Signout Error:", _e.message);
    }
  }
  async invalidate(): Promise<void> {
    try {
      await Request(await this.postTokensOnlyConfig(apiurls.baseURL.auth + apiurls.post.user.invalidate))
    } catch (_e) {
      console.error("Invalidate Error:", _e.message);
    }
  }
  async getNameHistory(): Promise<Name[]> {
    return await API.getNamesFromUUID(this.uuid);
  }
  // TODO
  // setSkin() { }
  // resetSkin() { }
  async getRealmsInvites(): Promise<Invite[]> {
    return JSON.parse(await Request.get(await this.getConfig(apiurls.baseURL.java + apiurls.get.user.pending_invites))).invites;
  }
  async getRealmsInvitesCount(): Promise<number> {
    return await Request.get(await this.getConfig(apiurls.baseURL.java + apiurls.get.user.pending_invites_count));
  }
  
  async getAccessibleRealms(): Promise<Realm[]>{
    let fakeRealms: any[] = JSON.parse(await Request.get(await this.getConfig(apiurls.baseURL.java + apiurls.get.user.get_servers))).servers;
    let realRealms: Realm[] = [];
    // console.log(fakeRealms);
    for(let fr of fakeRealms){
      let r: Realm = new Realm(this);
      r = Object.assign(r, fr);
      realRealms.push(r);
      // if(fr.owner == "Plagiatus") console.log(fr);
    }
    return realRealms;
  }

  async getOwnedRealms(): Promise<Realm[]> {
    let allRealms: Realm[] = await this.getAccessibleRealms();
    let ownedRealms: Realm[] = [];
    for (let realm of allRealms){
      if(realm.owner == await this.getName()){
        realm = Object.assign(realm, await realm.get());
        ownedRealms.push(realm);
      }
    }
    return ownedRealms;
  }

  async getConfig(_url: string): Promise<any> {
    let config = {
      url: _url,
      headers: {
        "Cookie": "sid=token:" + this.accessToken + ":" + await this.getUUID() + ";user=" + await this.getName() + ";version=1.14.4" //TODO: don't hardcode the version. 
      }
    }
    return config;
  }

  private async postAuthenticationConfig(_url: string): Promise<any> {
    return {
      url: _url,
      method: "POST",
      headers: [{
        name: "Content-Type",
        value: "application/json",
      }],
      body: {
        agent: {                              // defaults to Minecraft
          name: "Minecraft",                // For Mojang's other game Scrolls, "Scrolls" should be used
          version: 1                        // This number might be increased by the vanilla client in the future
        },
        username: this.email,      // Can be an email address or player name for unmigrated accounts
        password: this.password,

        clientToken: apiurls.clientToken,     // optional
        // "requestUser": true                     // optional; default: false; true adds the user object to the response
      },
      json: true
    }
  }
  async postTokensOnlyConfig(_url: string): Promise<any> {
    return {
      url: _url,
      method: "POST",
      headers: [{
        name: "Content-Type",
        value: "application/json",
      }],
      body: {
        accessToken: this.accessToken,
        clientToken: apiurls.clientToken,
      },
      json: true
    }
  }
  async postCredentialsOnlyConfig(_url: string): Promise<any> {
    return {
      url: _url,
      method: "POST",
      headers: [{
        name: "Content-Type",
        value: "application/json",
      }],
      body: {
        username: this.email,
        password: this.password
      },
      json: true
    }
  }
}