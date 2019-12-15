namespace overview {

  window.addEventListener("load", init);
  let realmsList: HTMLDivElement;

  function init() {
    if (!checkCredentials(false)) {
      window.location.replace("login");
      return;
    }
    realmsList = <HTMLDivElement>document.getElementById("realmsList");
    createRealmsDisplay();
  }

  function createRealmsDisplay() {
    let data = getCredentials();
    data["command"] = "getWorlds";
    try {
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open("POST", serverAddress, false);
      xhr.send(JSON.stringify(data));
      if (xhr.response) {
        let result = JSON.parse(xhr.response);
        console.log(result);
        if (result.error) {
          displayError(result.error);
          return;
        }
        if (result.servers && result.servers.length > 0) {
          realmsList.innerHTML = "";
          for (let s of result.servers) {
            createOneRealm(s, data.name);
          }
        }
      }
    } catch (error) {
      displayError(error);
    }
  }

  function createOneRealm(_server: Server, ownerName: string) {
    let owner: boolean = _server.owner == ownerName;
    realmsList.innerHTML +=
      `<div class="realm">
  <img src="https://crafatar.com/avatars/${_server.ownerUUID}?size=40&overlay" alt="">
  <span>${_server.properties.name || ""}</span>
  <span>${_server.minigameName ? "Minigame: " + _server.minigameName : _server.properties.description || ""}</span>
  <span>${_server.owner}</span>
  <button onclick="${owner ? "overview.selectRealm(" + _server.id + ")" : "overview.leaveRealm(" + _server.id + ")"}">${owner ? "Edit" : "Leave"}</button>
  </div>`;
    //TODO add status of realm
  }

  export function selectRealm(id: number) {
    setCookie("worldid", id.toString());
    window.location.replace("./overview");
  }

  export function leaveRealm(id: number) {
    //TODO doublecheck if they really want to leave
  }


  interface Server {
    id: number,
    owner: string,
    ownerUUID: string,
    daysLeft: number,
    expired: boolean,
    minigameName: string,
    properties: {
      name: string,
      description: string
    }
    state: string;
    worldType: string;
  }
}