window.addEventListener("load", init);

interface Player {
  name: string,
  uuid: string,
  operator: boolean,
  accepted: boolean,
  online: boolean
}

let playerListDiv: HTMLDivElement;
let searchInput: HTMLInputElement;
let inviteInput: HTMLInputElement;
let inviteButton: HTMLButtonElement;
let players: Player[];
let includeOffline: boolean = true;
let includeInvited: boolean = true;
let excludeNonOp: boolean = false;
let includeOfflineInput: HTMLInputElement;
let includeInvitedInput: HTMLInputElement;
let excludeNonOpInput: HTMLInputElement;

async function init() {
  //TODO save/load using cookies to make it load faster
  checkWorldId();
  checkCredentials();
  searchInput = <HTMLInputElement>document.getElementById("search");
  playerListDiv = <HTMLDivElement>document.getElementById("playerList");
  inviteInput = <HTMLInputElement>document.getElementById("invite");
  inviteButton = <HTMLButtonElement>document.getElementById("inviteButton");
  searchInput.value = "";
  inviteInput.value = "";
  searchInput.addEventListener("input", searchBtn);
  players = await getPlayers();
  updatePlayerDisplay(players);
  setupSettings();
}

async function getPlayers(): Promise<Player[]> {
  let tmp = getPerformanceCookie(worldName());
  if (tmp) {
    return JSON.parse(tmp).players;
  }
  let data = getCredentials();
  data["command"] = "detail";
  data["world"] = worldid;
  let result = await sendPOSTRequest(data, null);
  setPerformanceCookie(worldName(), JSON.stringify(result));
  return result.players;
}

function updatePlayerDisplay(players: Player[]) {
  playerListDiv.innerHTML = players.length > 0 ? "" : "There doesn't seem to be anyone here. Start by inviting someone.";
  players.sort(sortPlayers);
  for (let i: number = 0; i < players.length; i++) {
    createOnePlayer(players[i]);
  }
}

function createOnePlayer(p: Player) {
  let div: HTMLDivElement = document.createElement("div");
  div.innerHTML = `<img class="onlinestatus" src="${p.accepted ? (p.online ? "../img/online_icon.png" : "../img/offline_icon.png") : "../img/not_accepted_icon.png"}" alt="${p.accepted ? (p.online ? "on" : "off") : "off"}">
  <img class="avatar" src="https://crafatar.com/avatars/${p.uuid}?size=48&overlay" alt="">
  <img class="crown ${p.operator ? "" : "hidden"}" src="../img/op_icon.png" alt="">
  <span class="playername"><img class="crown2 ${p.operator ? "" : "hidden"}" src="../img/op_icon.png" alt="">${escapeHtml(p.name) || ""}</span>
  <button class="opBtn" onclick="toggleOP('${p.uuid}', ${!p.operator})">${p.operator ? "deop" : "op"}</button>
  <button class="kick" onclick="kick('${p.uuid}')">Kick</button>`;
  div.classList.add("player");
  div.classList.add(p.accepted ? "accepted" : "notAccepted");
  div.id = p.uuid;
  playerListDiv.appendChild(div);
  // playerListDiv.innerHTML +=
  //   `<div class="player ${p.accepted ? "accepted" : "notAccepted"}" id="${p.uuid}">
  //     <img class="onlinestatus" src="${p.accepted ? (p.online ? "../img/online_icon.png" : "../img/offline_icon.png") : "../img/not_accepted_icon.png"}" alt="${p.accepted ? (p.online ? "on" : "off") : "off"}">
  //     <img class="avatar" src="https://crafatar.com/avatars/${p.uuid}?size=48&overlay" alt="">
  //     <img class="crown ${p.operator ? "" : "hidden"}" src="../img/op_icon.png" alt="">
  //     <span class="playername"><img class="crown2 ${p.operator ? "" : "hidden"}" src="../img/op_icon.png" alt="">${escapeHtml(p.name) || ""}</span>
  //     <button class="opBtn" onclick="toggleOP('${p.uuid}', ${!p.operator})">${p.operator ? "deop" : "op"}</button>
  //     <button class="kick" onclick="kick('${p.uuid}')">Kick</button>
  //   </div>`;
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

function toggleOP(_uuid: string, toggle: boolean) {
  let div: HTMLDivElement = <HTMLDivElement>document.getElementById(_uuid);
  let btn: HTMLButtonElement = <HTMLButtonElement>div.querySelector(".opBtn");
  btn.disabled = true;

  let data = getCredentials();
  data["command"] = "toggleOP";
  data["world"] = worldid;
  data["playeruuid"] = _uuid;
  data["toggle"] = toggle;
  sendPOSTRequest(data, null)
    .then(() => {
      btn.setAttribute("onclick", `toggleOP("${_uuid}", ${!toggle})`);
      btn.innerText = toggle ? "deop" : "op";
      btn.disabled = false;
      if (toggle) {
        div.querySelector(".crown").classList.remove("hidden");
        div.querySelector(".crown2").classList.remove("hidden");
      } else {
        div.querySelector(".crown").classList.add("hidden");
        div.querySelector(".crown2").classList.add("hidden");
      }
      players.find(p => p.uuid == _uuid).operator = toggle;
      search(searchInput.value);
    });
}

function searchBtn(_e: Event) {
  let searchterm: string = (<HTMLInputElement>_e.target).value.trim();
  search(searchterm);
}
function search(searchterm: string) {
  for (let p of players) {
    let div: HTMLDivElement = <HTMLDivElement>document.getElementById(p.uuid);
    if (!div) continue;
    if (shouldPlayerBeVisible(p, searchterm)) {
      div.classList.remove("hidden");
    } else {
      div.classList.add("hidden");
    }
  }
}
function shouldPlayerBeVisible(p: Player, s: string) {
  if (excludeNonOp && !p.operator) return false;
  if (!includeInvited && !p.accepted) return false;
  if (!includeOffline && !p.online) return false;
  s = s.toLowerCase();
  if (p.name.toLowerCase().includes(s) || s == "") return true;
  return false;
}

function invite() {
  inviteInput.disabled = true;
  inviteButton.disabled = true;
  let playername: string = inviteInput.value.trim();
  let data = getCredentials();
  data["command"] = "invite";
  data["world"] = worldid;
  data["playername"] = playername;

  sendPOSTRequest(data, null)
    .then((result) => {
      players = result.players;
      updatePlayerDisplay(result.players);
      setPerformanceCookie(worldName(), JSON.stringify(result));
      //TODO: add new player to the list. it should hopefully be in the response.
      // or just update the player list altogether if it's the server that's being sent back.
      // also, give feedback over whether it worked or not
    })
    .finally(() => {
      inviteInput.disabled = false;
      inviteButton.disabled = false;
    })

}

function kick(uuid: string) {
  let div: HTMLDivElement = <HTMLDivElement>document.getElementById(uuid);
  let btn: HTMLButtonElement = <HTMLButtonElement>div.querySelector(".kick");
  btn.disabled = true;
  let data = getCredentials();
  data["command"] = "kick";
  data["world"] = worldid;
  data["playeruuid"] = uuid;
  sendPOSTRequest(data, null)
    .then((result) => {
      let realm: RealmsServer = JSON.parse(getPerformanceCookie(worldName()));
      realm.players.splice(realm.players.findIndex((p) => { return p.uuid == uuid }), 1);
      setPerformanceCookie(worldName(), JSON.stringify(realm));
      div.parentElement.removeChild(div);
      players.splice(players.findIndex(p => p.uuid == uuid), 1);
    })
    .catch(() => {
      btn.disabled = false;
    })
}

function setupSettings() {
  includeOfflineInput = <HTMLInputElement>document.getElementById("includeOffline");
  includeInvitedInput = <HTMLInputElement>document.getElementById("includeNotAccepted");
  excludeNonOpInput = <HTMLInputElement>document.getElementById("showOnlyOP");
  includeOfflineInput.addEventListener("change", updateSettings);
  includeInvitedInput.addEventListener("change", updateSettings);
  excludeNonOpInput.addEventListener("change", updateSettings);
  updateSettings();
}

function updateSettings() {
  includeOffline = includeOfflineInput.checked;
  includeInvited = includeInvitedInput.checked;
  excludeNonOp = excludeNonOpInput.checked;
  search(searchInput.value);
}