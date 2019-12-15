window.addEventListener("load", init);
let realmsList;
function init() {
    if (!checkCredentials(false)) {
        window.location.replace("login");
        return;
    }
    realmsList = document.getElementById("realmsList");
    createRealmsDisplay();
}
function createRealmsDisplay() {
    let data = getCredentials();
    data["command"] = "getWorlds";
    try {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8100", false);
        xhr.send(JSON.stringify(data));
        if (xhr.response) {
            let result = JSON.parse(xhr.response);
            console.log(result);
            if (result.error) {
                displayError(result.error);
                return;
            }
            for (let s of result.servers) {
                createOneRealm(s, data.name);
            }
        }
    }
    catch (error) {
        displayError(error);
    }
}
function createOneRealm(_server, ownerName) {
    let owner = _server.owner == ownerName;
    realmsList.innerHTML +=
        `<div class="realm">
  <img src="https://crafatar.com/avatars/${_server.ownerUUID}?size=40&overlay" alt="">
  <span>${_server.properties.name || ""}</span>
  <span>${_server.minigameName ? "Minigame: " + _server.minigameName : _server.properties.description || ""}</span>
  <span>${_server.owner}</span>
  <button onclick="${owner ? "selectRealm(" + _server.id + ")" : "leaveRealm(" + _server.id + ")"}">${owner ? "Edit" : "Leave"}</button>
  </div>`;
    //TODO add status of realm
}
function selectRealm(id) {
    setCookie("worldid", id.toString());
    window.location.replace("./overview");
}
function leaveRealm(id) {
    //TODO doublecheck if they really want to leave
}
