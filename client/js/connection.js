var RealmPage;
(function (RealmPage) {
    let ip = "http://localhost:8100";
    async function attemptLoginWithPassword(_emai, _pw) {
        return await sendPostRequest(ip, { email: _emai, password: _pw, command: "loginWithPW" });
    }
    RealmPage.attemptLoginWithPassword = attemptLoginWithPassword;
    async function attemptLoginWithToken(_u, _t) {
        return await sendPostRequest(ip, { username: _u, token: _t, command: "loginWithToken" });
    }
    RealmPage.attemptLoginWithToken = attemptLoginWithToken;
    async function getOwnedRealms(_owner) {
        return await sendPostRequest(ip, { username: _owner.name, token: _owner.accessToken, uuid: _owner.uuid, command: "getOwnedRealms" });
    }
    RealmPage.getOwnedRealms = getOwnedRealms;
    async function removePlayer(_owner, _realm, _uuid) {
        return await sendPostRequest(ip, { username: _owner.name, token: _owner.accessToken, uuid: _owner.uuid, command: "removePlayer", worldID: _realm.id, playerUUID: _uuid });
    }
    RealmPage.removePlayer = removePlayer;
    async function invitePlayer(_owner, _realm, _name) {
        return await sendPostRequest(ip, { username: _owner.name, token: _owner.accessToken, uuid: _owner.uuid, command: "invitePlayer", worldID: _realm.id, playerName: _name });
    }
    RealmPage.invitePlayer = invitePlayer;
    async function opPlayer(_owner, _realm, _uuid) {
        return await sendPostRequest(ip, { username: _owner.name, token: _owner.accessToken, uuid: _owner.uuid, command: "opPlayer", worldID: _realm.id, playerUUID: _uuid });
    }
    RealmPage.opPlayer = opPlayer;
    async function deopPlayer(_owner, _realm, _uuid) {
        return await sendPostRequest(ip, { username: _owner.name, token: _owner.accessToken, uuid: _owner.uuid, command: "deopPlayer", worldID: _realm.id, playerUUID: _uuid });
    }
    RealmPage.deopPlayer = deopPlayer;
    async function getUUID(_name) {
        return await sendPostRequest(ip, { playerName: _name, command: "getUUID" });
    }
    RealmPage.getUUID = getUUID;
    async function sendPostRequest(_url, _data = {}) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", _url, false);
        xhr.send(JSON.stringify(_data));
        if (xhr.response) {
            console.log(xhr.response);
            return JSON.parse(xhr.response);
        }
        else
            return "No reply.";
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
})(RealmPage || (RealmPage = {}));
//# sourceMappingURL=connection.js.map