var overview;
(function (overview) {
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
            xhr.open("POST", serverAddress, false);
            xhr.send(JSON.stringify(data));
            if (xhr.response) {
                let result = JSON.parse(xhr.response);
                if (result.error) {
                    displayError(result.error);
                    return;
                }
                if (result.servers && result.servers.length > 0) {
                    console.log(result.servers);
                    result.servers = result.servers.sort(sortRealms);
                    realmsList.innerHTML = "";
                    console.log(result.servers);
                    for (let s of result.servers) {
                        // console.log(s);
                        createOneRealm(s, data.name);
                    }
                }
                else {
                    realmsList.innerHTML = "Nothing to see here. You don't seem to have";
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
            `<div class="realm ${owner ? "owned" : "notOwned"}">
        <img src="" alt="${_server.expired ? "expired" : "active"}">
        <img src="https://crafatar.com/avatars/${_server.ownerUUID}?size=40&overlay" alt="">
        <span>${_server.properties.name || ""}</span>
        <span>${_server.minigameName ? "Minigame: " + _server.minigameName : _server.properties.description || ""}</span>
        <span>${_server.owner}</span>
        <button onclick="${owner ? "overview.selectRealm(" + _server.id + ")" : "overview.leaveRealm(" + _server.id + ")"}">${owner ? "Edit" : "Leave"}</button>
      </div>`;
        //TODO add status of realm
    }
    function sortRealms(a, b) {
        let owner = getCookie("name");
        if (a.owner == owner && b.owner != owner)
            return -1;
        if (a.owner != owner && b.owner == owner)
            return 1;
        if (a.expired && !b.expired)
            return 1;
        if (!a.expired && b.expired)
            return -1;
        return a.owner > b.owner;
    }
    function selectRealm(id) {
        setCookie("worldid", id.toString());
        window.location.replace("./overview");
    }
    overview.selectRealm = selectRealm;
    function leaveRealm(id) {
        //TODO doublecheck if they really want to leave
    }
    overview.leaveRealm = leaveRealm;
})(overview || (overview = {}));
