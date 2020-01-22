window.addEventListener("load", init);
let playerListDiv;
let searchInput;
let inviteInput;
let inviteButton;
let players;
let includeOffline = true;
let includeInvited = true;
let excludeNonOp = false;
let includeOfflineInput;
let includeInvitedInput;
let excludeNonOpInput;
function init() {
    //TODO save/load using cookies to make it load faster
    checkWorldId();
    checkCredentials();
    searchInput = document.getElementById("search");
    playerListDiv = document.getElementById("playerList");
    inviteInput = document.getElementById("invite");
    inviteButton = document.getElementById("inviteButton");
    searchInput.value = "";
    inviteInput.value = "";
    searchInput.addEventListener("input", searchBtn);
    players = getPlayers();
    updatePlayerDisplay(players);
    setupSettings();
}
function getPlayers() {
    let data = getCredentials();
    data["command"] = "getPlayers";
    data["world"] = getCookie("worldid");
    return sendPOSTRequest(data);
}
function updatePlayerDisplay(players) {
    playerListDiv.innerHTML = players.length > 0 ? "" : "There doesn't seem to be anyone here. Start by inviting someone.";
    players.sort(sortPlayers);
    for (let i = 0; i < players.length; i++) {
        createOnePlayer(players[i]);
    }
}
function createOnePlayer(p) {
    playerListDiv.innerHTML +=
        `<div class="player ${p.accepted ? "accepted" : "notAccepted"}" id="${p.uuid}">
      <img class="onlinestatus" src="${p.accepted ? (p.online ? "../img/online_icon.png" : "../img/offline_icon.png") : "../img/not_accepted_icon.png"}" alt="${p.accepted ? (p.online ? "on" : "off") : "off"}">
      <img class="avatar" src="https://crafatar.com/avatars/${p.uuid}?size=48&overlay" alt="">
      <img class="crown ${p.operator ? "" : "hidden"}" src="../img/op_icon.png" alt="">
      <span class="playername">${escapeHtml(p.name) || ""}</span>
      <button class="opBtn" onclick="toggleOP('${p.uuid}', ${!p.operator})">${p.operator ? "deop" : "op"}</button>
      <button class="kick" onclick="kick('${p.uuid}')">Kick</button>
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
    let btn = div.querySelector(".opBtn");
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
    if (toggle) {
        div.querySelector(".crown").classList.remove("hidden");
    }
    else {
        div.querySelector(".crown").classList.add("hidden");
    }
}
function searchBtn(_e) {
    let searchterm = _e.target.value.trim();
    search(searchterm);
}
function search(searchterm) {
    for (let p of players) {
        let div = document.getElementById(p.uuid);
        if (!div)
            continue;
        if (shouldPlayerBeVisible(p, searchterm)) {
            div.classList.remove("hidden");
        }
        else {
            div.classList.add("hidden");
        }
    }
}
function shouldPlayerBeVisible(p, s) {
    if (excludeNonOp && !p.operator)
        return false;
    if (!includeInvited && !p.accepted)
        return false;
    if (!includeOffline && !p.online)
        return false;
    s = s.toLowerCase();
    if (p.name.toLowerCase().includes(s) || s == "")
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
    let result = sendPOSTRequest(data);
    updatePlayerDisplay(result.players);
    //TODO: add new player to the list. it should hopefully be in the response.
    // or just update the player list altogether if it's the server that's being sent back.
    inviteInput.disabled = false;
    inviteButton.disabled = false;
}
function kick(uuid) {
    let div = document.getElementById(uuid);
    let btn = div.querySelector(".kick");
    btn.disabled = true;
    let data = getCredentials();
    data["command"] = "kick";
    data["world"] = getCookie("worldid");
    data["playeruuid"] = uuid;
    let result = sendPOSTRequest(data);
    if (result.error) {
        btn.disabled = false;
        return;
    }
    div.parentElement.removeChild(div);
}
function setupSettings() {
    includeOfflineInput = document.getElementById("includeOffline");
    includeInvitedInput = document.getElementById("includeNotAccepted");
    excludeNonOpInput = document.getElementById("showOnlyOP");
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
