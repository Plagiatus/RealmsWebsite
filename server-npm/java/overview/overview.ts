namespace overview {

  window.addEventListener("load", init);

  let generalDiv: HTMLDivElement;
  let playersDiv: HTMLDivElement;
  let worldsDiv: HTMLDivElement;
  let playerListDiv: HTMLDivElement;

  function init() {
    // checkWorldId();
    // checkCredentials();
    initReferences();
    createOverview();
  }

  function initReferences() {
    generalDiv = <HTMLDivElement>document.getElementById("general");
    playersDiv = <HTMLDivElement>document.getElementById("players");
    worldsDiv = <HTMLDivElement>document.getElementById("worlds");
    playerListDiv = <HTMLDivElement>document.getElementById("playerList");
  }

  function createOverview() {
    //TODO save/load using cookies to make it display faster
    let data = getCredentials();
    data["command"] = "detail";
    data["world"] = getCookie("worldid");
    let result: RealmsServer = sendPOSTRequest(data);
    generalOverview(result);
    worldOverview(result);
    playerOverview(result.players);
    setInterval(updatePlayers, 1000 * 15);
  }

  function generalOverview(r: RealmsServer) {
    generalDiv.innerHTML = `
      <img src="${r.expired ? "" : ""}" alt="${r.expired ? "expired" : "active"}">
      <span id="realmName">${r.properties.name}</span>
      <span id="realmDescription">${r.properties.description}</span>
      <span id="realmID">${r.id}</span>
      <span id="realmSubscriptionStatus">${formatDays(r.daysLeft)}</span>
    `;
  }

  function formatDays(daysLeft: number): string {
    if (daysLeft <= 0) {
      return "Susbscription ran out.";
    }
    let now: Date = new Date();
    let end: Date = new Date(Date.now() + 1000 * 60 * 60 * 24 * daysLeft);
    let year: number = end.getFullYear() - now.getFullYear();
    let months: number = end.getMonth() - now.getMonth();
    let days: number = end.getDate() - now.getDate();
    if (days < 0) {
      months--;
      days += 30;
    }
    if (months < 0) {
      year--;
      months += 12;
    }
    return `${year > 0 ? year + (year == 1 ? " year, " : " years, ") : ""}${months > 0 ? months + (months == 1 ? " month" : " months") + " and " : ""}${days} ${days == 1 ? "day" : "days"} remaining`;
  }

  function worldOverview(r: RealmsServer) {
    r.slots = new Map(r.slots);
    let active: RealmsWorldOptions = r.slots.get(r.activeSlot);
    worldsDiv.innerHTML = `
    <img src=${active.templateImage ? "data:image/png;base64, " + active.templateImage : "../img/placeholder.png"} alt="">
    <span>${active.slotName || "World " + r.activeSlot}</span>
    <span></span>
    `;
  }

  function playerOverview(players: Player[]) {
    players.sort(sortPlayers);
    playerListDiv.innerHTML = players.length > 0 ? "" : "<span>Nobody is online.</span>";
    let online: number = 0;
    for (let i: number = 0; i < players.length; i++) {
      if (players[i].online) {
        online++;
        playerListDiv.innerHTML +=
          `<div class="player">
            <img src="https://crafatar.com/avatars/${players[i].uuid}?size=40&overlay" alt="" width="40px" height="40px">
            <span>${players[i].name || ""}</span>
          </div>`;
      }
    }
    playersDiv.querySelector("span").innerText = `Currently online: ${online}/10`;
  }

  function updatePlayers() {
    let data = getCredentials();
    data["command"] = "getPlayers";
    data["world"] = getCookie("worldid");
    let result = sendPOSTRequest(data);
    playerOverview(result);
  }


  function sortPlayers(a: Player, b: Player): number {
    if (a.online && !b.online) return -1;
    if (!a.online && b.online) return 1;

    if (a.accepted && !b.accepted) return -1;
    if (!a.accepted && b.accepted) return 1;
    let aname: string = a.name.toLowerCase();
    let bname: string = b.name.toLowerCase();
    if (aname < bname) return -1;
    if (aname > bname) return 1;
    return 0;
  }


  interface RealmsServer {
    id: number;
    remoteSubscriptionId: number;
    owner: string;
    ownerUUID: string;
    properties: { name: string, description: string };
    defaultPermission: string;
    state: string;
    daysLeft: number;
    expired: boolean;
    expiredTrial: boolean;
    gracePeriod: boolean;
    worldType: string;
    players: Player[];
    maxPlayers: number;
    minigameName: string;
    minigameId: number;
    minigameImage: string;
    activeSlot: number;
    slots: Map<number, RealmsWorldOptions>;
    member: boolean;
    clubId: number;
  }
  interface Player {
    name: string;
    uuid: string;
    operator: boolean;
    accepted: boolean;
    online: boolean;
  }
  interface RealmsWorldOptions {
    slotName: string;
    templateId: number;
    templateImage: string;
    adventureMap: boolean;
    empty: boolean;
  }
}