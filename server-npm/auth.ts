import * as Request from "request-promise-native/";

export class Auth {
  private baseUrl: string = "https://authserver.mojang.com";
  private authenticateUrl: string = "/authenticate";
  private refreshUrl: string = "/refresh";
  private validateUrl: string = "/validate";
  invalidateUrl: string = "/invalidate";
  // signoutUrl: string = "/signout";

  async validate(_p: Player): Promise<void> {
    try {
      await Request(await _p.postTokensOnlyConfig(this.baseUrl + this.validateUrl))
    } catch (_e) {
      console.error("Error validating. Attempting to refresh...");
      try {
        await this.refreshToken(_p);
      } catch (error) {
        console.error("Error refreshing token. Please authenticate instead.");
        throw (new Error("Error refreshing token. Please log in again."));
      }
    }
  }
  async authenticate(_p: Player, _password: string): Promise<void> {
    try {
      let some = await Request(await _p.postAuthenticationConfig(this.baseUrl + this.authenticateUrl, _password));
      _p.token = some.accessToken;
      _p.name = some.selectedProfile.name;
      _p.uuid = some.selectedProfile.id;
    } catch (error) {
      console.error("Authentication Error:", error.message)
      throw error;
    }
  }
  private async refreshToken(_p: Player): Promise<void> {
    try {
      let some = await Request(await _p.postTokensOnlyConfig(this.baseUrl + this.refreshUrl));
      _p.token = some.accessToken;
    } catch (error) {
      console.error("Refresh Error:", error.message);
      throw error;
    }
  }
  async invalidate(_p: Player): Promise<void>{
    try {
      let some = await Request(await _p.postTokensOnlyConfig(this.baseUrl + this.invalidateUrl));
    } catch (error) {
      console.error("Invalidate Error:", error.message);
      throw (error);
    }
  }
}



export class Player {
  email: string;
  name: string;
  token: string;
  uuid: string;

  constructor(_email: string, _token: string="",_uuid: string = "", _name: string="") {
    this.email = _email;
    this.uuid = _uuid;
    this.token = _token;
    this.name = _name;
  }

  getAuthToken(): string {
    return "token:" + this.token + ":" + this.uuid
  }

  async postAuthenticationConfig(_url: string, _password: string): Promise<any> {
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
        password: _password,

        clientToken: "058d62d539b34158a3fb2023d524be22",     // optional
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
        accessToken: this.token,
        clientToken: "058d62d539b34158a3fb2023d524be22",
      },
      json: true
    }
  }
  // async postCredentialsOnlyConfig(_url: string, _password: string): Promise<any> {
  //   return {
  //     url: _url,
  //     method: "POST",
  //     headers: [{
  //       name: "Content-Type",
  //       value: "application/json",
  //     }],
  //     body: {
  //       username: this.email,
  //       password: _password
  //     },
  //     json: true
  //   }
  // }
}