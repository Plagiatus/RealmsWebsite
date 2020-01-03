namespace overview {

  window.addEventListener("load", init);
  let realmsList: HTMLDivElement;

  function init() {
    document.getElementsByTagName("h1")[0].innerText = "Welcome " + getCookie("name");
    if (!checkCredentials(false)) {
      window.location.replace("login");
      return;
    }
    document.getElementById("showAll").addEventListener("change", toggleVisibility);
    realmsList = <HTMLDivElement>document.getElementById("realmsList");
    createRealmsDisplay();
    document.getElementById("showAll").dispatchEvent(new Event("change"));
  }

  function createRealmsDisplay() {
    let data = getCredentials();
    data["command"] = "getWorlds";
    let result = sendPOSTRequest(data);
    if (result.servers && result.servers.length > 0) {
      console.log(result.servers);
      result.servers = result.servers.sort(sortRealms);
      realmsList.innerHTML = "";
      console.log(result.servers);
      for (let s of result.servers) {
        // console.log(s);
        createOneRealm(s, data.name);
      }
    } else {
      realmsList.innerHTML = "Nothing to see here. You don't seem to have";
    }
  }

  function createOneRealm(_server: Server, ownerName: string) {
    let owner: boolean = _server.owner == ownerName;
    realmsList.innerHTML +=
      `<div class="realm ${owner ? "owned" : "notOwned"} ${_server.expired ? "expired" : ""}">
        <img src="" alt="${_server.expired ? "expired" : "active"}">
        <img src="https://crafatar.com/avatars/${_server.ownerUUID}?size=40&overlay" alt="">
        <span>${_server.properties.name || ""}</span>
        <span>${_server.minigameName ? "Minigame: " + _server.minigameName : _server.properties.description || ""}</span>
        <span>${_server.owner}</span>
        <button onclick="${owner ? "overview.selectRealm(" + _server.id + ")" : "overview.leaveRealm(" + _server.id + ")"}">${owner ? "Edit" : "Leave"}</button>
      </div>`;
    //TODO add status of realm
  }

  function sortRealms(a: Server, b: Server) {
    let owner: string = getCookie("name");
    if (a.owner == owner && b.owner != owner) return -1;
    if (a.owner != owner && b.owner == owner) return 1;
    if (a.expired && !b.expired) return 1;
    if (!a.expired && b.expired) return -1;
    return a.owner > b.owner;
  }

  function toggleVisibility(_e: Event) {
    let hideOthers: boolean = (<HTMLInputElement>_e.target).checked;
    for (let elem of document.getElementsByClassName("notOwned")) {
      hideOthers ? elem.classList.add("hidden") : elem.classList.remove("hidden");
    }
  }

  export function selectRealm(id: number) {
    setCookie("worldid", id.toString());
    window.location.replace("./overview");
  }

  export function leaveRealm(id: number) {
    let really: string = prompt(`If you really want to leave this realm, type "LEAVE" and click send.\nTo abort, type anything else.`);
    if (really != "LEAVE") return;
    console.log("Yes, really.");
    let data = getCredentials();
    data["command"] = "leaveRealm";
    data["world"] = id;
    let result = sendPOSTRequest(data);
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