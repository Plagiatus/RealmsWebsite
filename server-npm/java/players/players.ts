window.addEventListener("load", init);

interface Player {
  name: string,
  uuid: string,
  operator: boolean,
  accepted: boolean,
  online: boolean
}

let playerListDiv: HTMLDivElement;
let inviteInput: HTMLInputElement;
let inviteButton: HTMLButtonElement;
let players: Player[];
function init() {
  // checkWorldId();
  // checkCredentials();
  playerListDiv = <HTMLDivElement>document.getElementById("playerList");
  inviteInput = <HTMLInputElement> document.getElementById("invite");
  inviteButton = <HTMLButtonElement> document.getElementById("inviteButton");
  // players = getPlayers();
  createPlayerDisplay(players);
  document.getElementById("search").addEventListener("input", search);
}

function getPlayers(): Player[] {
  let data = getCredentials();
  data["command"] = "getPlayers";
  data["world"] = getCookie("worldid");
  try {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("POST", serverAddress, false);
    xhr.send(JSON.stringify(data));
    if (xhr.response) {
      let result = JSON.parse(xhr.response);
      if (result.error) {
        displayError(result.error);
        return;
      }
      return result;
    }
  } catch (error) {
    displayError(error);
  }
}

function createPlayerDisplay(players: Player[]) {
  playerListDiv.innerHTML = players.length > 0 ? "" : "There doesn't seem to be anyone here. Start by inviting someone.";
  players.sort(sortPlayers);
  for (let i: number = 0; i < players.length; i++) {
    createOnePlayer(players[i]);
  }
}

function createOnePlayer(p: Player) {
  playerListDiv.innerHTML +=
    `<div class="player ${p.accepted ? "accepted" : "notAccepted"}" id="${p.uuid}">
      <img src="" alt="${p.online ? "online" : "offline"}">
      <img src="https://crafatar.com/avatars/${p.uuid}?size=40&overlay" alt="" width="40px" height="40px">
      <span>${p.name || ""}</span>
      <button class="op" onclick="toggleOP('${p.uuid}', ${!p.operator})">${p.operator ? "deop" : "op"}</button>
      <button class="kick" onclick="kick(${p.name})">Kick</button>
    </div>`;
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
  let btn: HTMLButtonElement = <HTMLButtonElement>div.querySelector(".op");
  btn.disabled = true;
  
  let data = getCredentials();
  data["command"] = "toggleOP";
  data["world"] = getCookie("worldid");
  data["playeruuid"] = _uuid;
  data["toggle"] = toggle;
  let result = sendPOSTRequest(data);
  if(result.error) return;
  btn.setAttribute("onclick", `toggleOP("${_uuid}", ${!toggle})`);
  btn.innerText = toggle ? "deop" : "op";
  btn.disabled = false;
}

function search(_e: Event){
  let searchterm: string = (<HTMLInputElement>_e.target).value.trim();
  let showAll: boolean = searchterm == "";
  for(let p of players){
    let div: HTMLDivElement = <HTMLDivElement> document.getElementById(p.uuid);
    if(showAll || shouldPlayerBeVisible(p, searchterm)){
      div.classList.remove("hidden");
    } else {
      div.classList.add("hidden");
    }
  }
}
function shouldPlayerBeVisible(p: Player, s: string){
  s = s.toLowerCase();
  if(p.name.toLowerCase().indexOf(s) > -1) return true;
  return false;
}

function invite(){
  inviteInput.disabled = true;
  inviteButton.disabled = true;
  let playername: string = inviteInput.value.trim();
  let data = getCredentials();
  data["command"] = "invite";
  data["world"] = getCookie("worldid");
  data["playername"] = playername;
  console.log(data);
  
  let result = sendPOSTRequest(data);
  
  console.log(result);
  //TODO: add new player to the list. it should hopefully be in the response.
  // or just update the player list altogether if it's the server that's being sent back.

  inviteInput.disabled = false;
  inviteButton.disabled = false;
}