window.addEventListener("load", init);
let playerListDiv;
let inviteInput;
let inviteButton;
let players;
function init() {
    // checkWorldId();
    // checkCredentials();
    playerListDiv = document.getElementById("playerList");
    inviteInput = document.getElementById("invite");
    inviteButton = document.getElementById("inviteButton");
    // players = getPlayers();
    createPlayerDisplay(players);
    document.getElementById("search").addEventListener("input", search);
}
function getPlayers() {
    let data = getCredentials();
    data["command"] = "getPlayers";
    data["world"] = getCookie("worldid");
    try {
        let xhr = new XMLHttpRequest();
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
    }
    catch (error) {
        displayError(error);
    }
}
function createPlayerDisplay(players) {
    playerListDiv.innerHTML = players.length > 0 ? "" : "There doesn't seem to be anyone here. Start by inviting someone.";
    players.sort(sortPlayers);
    for (let i = 0; i < players.length; i++) {
        createOnePlayer(players[i]);
    }
}
function createOnePlayer(p) {
    playerListDiv.innerHTML +=
        `<div class="player ${p.accepted ? "accepted" : "notAccepted"}" id="${p.uuid}">
      <img src="" alt="${p.online ? "online" : "offline"}">
      <img src="https://crafatar.com/avatars/${p.uuid}?size=40&overlay" alt="" width="40px" height="40px">
      <span>${p.name || ""}</span>
      <button class="op" onclick="toggleOP('${p.uuid}', ${!p.operator})">${p.operator ? "deop" : "op"}</button>
      <button class="kick" onclick="kick(${p.name})">Kick</button>
    </div>`;
}
function sortPlayers(a, b) {
    if (a.online && !b.online)
        return -1;
    if (!a.online && b.online)
        return 1;
    if (a.accepted && !b.accepted)
        return -1;
    if (!a.accepted && b.accepted)
        return 1;
    let aname = a.name.toLowerCase();
    let bname = b.name.toLowerCase();
    if (aname < bname)
        return -1;
    if (aname > bname)
        return 1;
    return 0;
}
function toggleOP(_uuid, toggle) {
    let div = document.getElementById(_uuid);
    let btn = div.querySelector(".op");
    btn.disabled = true;
    let data = getCredentials();
    data["command"] = "toggleOP";
    data["world"] = getCookie("worldid");
    data["playeruuid"] = _uuid;
    data["toggle"] = toggle;
    let result = sendPOSTRequest(data);
    if (result.error)
        return;
    btn.setAttribute("onclick", `toggleOP("${_uuid}", ${!toggle})`);
    btn.innerText = toggle ? "deop" : "op";
    btn.disabled = false;
}
function search(_e) {
    let searchterm = _e.target.value.trim();
    let showAll = searchterm == "";
    for (let p of players) {
        let div = document.getElementById(p.uuid);
        if (showAll || shouldPlayerBeVisible(p, searchterm)) {
            div.classList.remove("hidden");
        }
        else {
            div.classList.add("hidden");
        }
    }
}
function shouldPlayerBeVisible(p, s) {
    s = s.toLowerCase();
    if (p.name.toLowerCase().indexOf(s) > -1)
        return true;
    return false;
}
function invite() {
    inviteInput.disabled = true;
    inviteButton.disabled = true;
    let playername = inviteInput.value.trim();
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
