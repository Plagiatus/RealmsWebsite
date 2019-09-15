namespace RealmPage {
  let ip: string = "http://localhost:8100";

  export async function attemptLoginWithPassword(_emai: string, _pw: string) {
    return await sendPostRequest(ip, { email: _emai, password: _pw, command: "loginWithPW" });
  }
  export async function attemptLoginWithToken(_u: string, _t: string) {
    return await sendPostRequest(ip, { username: _u, token: _t, command: "loginWithToken" });
  }

  export async function getOwnedRealms(_owner: Player) {
    return await sendPostRequest(ip, { username: _owner.name, token: _owner.accessToken, uuid: _owner.uuid, command: "getOwnedRealms" })
  }

  export async function removePlayer(_owner: Player, _realm: Realm, _uuid: string) {
    return await sendPostRequest(ip, { username: _owner.name, token: _owner.accessToken, uuid: _owner.uuid, command: "removePlayer", worldID: _realm.id, playerUUID: _uuid })
  }

  export async function invitePlayer(_owner: Player, _realm: Realm, _name: string) {
    return await sendPostRequest(ip, { username: _owner.name, token: _owner.accessToken, uuid: _owner.uuid, command: "invitePlayer", worldID: _realm.id, playerName: _name })
  }
  export async function opPlayer(_owner: Player, _realm: Realm, _uuid: string) {
    return await sendPostRequest(ip, { username: _owner.name, token: _owner.accessToken, uuid: _owner.uuid, command: "opPlayer", worldID: _realm.id, playerUUID: _uuid })
  }
  export async function deopPlayer(_owner: Player, _realm: Realm, _uuid: string) {
    return await sendPostRequest(ip, { username: _owner.name, token: _owner.accessToken, uuid: _owner.uuid, command: "deopPlayer", worldID: _realm.id, playerUUID: _uuid })
  }

  export async function getUUID(_name: string) {
    return await sendPostRequest(ip, { playerName: _name, command: "getUUID" });
  }

  async function sendPostRequest(_url: string, _data: any = {}): Promise<any> {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("POST", _url, false);
    xhr.send(JSON.stringify(_data));
    if (xhr.response) {
      console.log(xhr.response);
      return JSON.parse(xhr.response);
    }
    else return "No reply.";

    // fetch(_url, {
    //   method: "POST",
    //   mode: "cors",
    //   // credentials: "include",
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   // body: JSON.stringify(_data)
    // }).then(response => {
    //   console.log(response);
    //   if(response.ok) return response.json();
    //   else {
    //     console.log(response.statusText);
    //   }
    // });
  }

  // function sendRequestWithCustomData(_color: string): void {
  //   let xhr: XMLHttpRequest = new XMLHttpRequest();
  //   xhr.open("GET", ip + "?color=" + _color, true);
  //   xhr.addEventListener("readystatechange", handleStateChange);
  //   xhr.send();
  // }

  // function handleStateChange(_event: ProgressEvent): void {
  //   let xhr: XMLHttpRequest = <XMLHttpRequest>_event.target;
  //   if (xhr.readyState == XMLHttpRequest.DONE) {
  //     console.log("ready: " + xhr.readyState, " | type: " + xhr.responseType, " | status:" + xhr.status, " | text:" + xhr.statusText);
  //     console.log("response: " + xhr.response);
  //   }
  // }

}
