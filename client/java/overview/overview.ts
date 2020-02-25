namespace overview {

  window.addEventListener("load", init);

  let generalDiv: HTMLDivElement;
  let playersDiv: HTMLDivElement;
  let worldsDiv: HTMLDivElement;
  let playerListDiv: HTMLDivElement;
  let realm: RealmsServer;

  function init() {
    checkWorldId();
    checkCredentials();
    initReferences();
    createOverview();
    obfuscate();
  }

  function initReferences() {
    generalDiv = <HTMLDivElement>document.getElementById("general");
    playersDiv = <HTMLDivElement>document.getElementById("players");
    worldsDiv = <HTMLDivElement>document.getElementById("worlds");
    playerListDiv = <HTMLDivElement>document.getElementById("playerList");
  }

  function createOverview() {
    if (getCookie(worldName())) {
      realm = JSON.parse(getPerformanceCookie(worldName()));
    } else {
      let data = getCredentials();
      data["command"] = "detail";
      data["world"] = getCookie("worldid");
      let result: RealmsServer = sendPOSTRequest(data);
      realm = result;
      setPerformanceCookie(worldName(), JSON.stringify(realm));
    }
    generalOverview(realm);
    worldOverview(realm);
    setInterval(updatePlayers, 1000 * 15);
    playerOverview(realm.players);
  }

  function generalOverview(r: RealmsServer) {
    let imgURL: string = "";
    if (r.state == "OPEN") imgURL = r.daysLeft > 15 ? "../img/on_icon.png" : "../img/expires_soon_icon.png";
    if (r.state == "CLOSED") imgURL = "../img/off_icon.png";
    if (r.expired) imgURL = "../img/expired_icon.png";
    generalDiv.innerHTML = `
      <img src="${imgURL}" alt="${r.expired ? "expired" : "active"}">
      <span id="realmName">${applyFormatingCodes(escapeHtml(r.properties.name))}</span><br>
      <span id="realmDescription">${applyFormatingCodes(escapeHtml(r.properties.description))}</span><br>
      <span id="realmID">Id: ${r.id}</span><br>
      <span id="realmSubscriptionStatus">${formatDays(r.daysLeft)}</span><br>
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
    let active: RealmsWorldOptions = r.slots[r.activeSlot];
    worldsDiv.innerHTML = "";
    if (r.minigameId) {
      worldsDiv.innerHTML += `
      <span>Selected Minigame</span>
      <img src="${r.minigameImage ? "data:image/png;base64, " + r.minigameImage : "../img/placeholder.png"}" alt="">
      <span>${r.minigameName || "World " + r.activeSlot}</span>
      `;
    } else {
      worldsDiv.innerHTML += `
      <span>Selected Slot</span>
      <img src="${active.templateImage ? "data:image/png;base64, " + active.templateImage : ("../img/placeholder.png")}" alt="">
      <span>${active.slotName || "World " + r.activeSlot}</span>
      `;
    }
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
            <img src="https://crafatar.com/avatars/${players[i].uuid}?size=48&overlay" alt="">
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

  function removeFormatCodes(s: string): string {
    return s.replace(/§./g, "");
  }
}