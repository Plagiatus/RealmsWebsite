var overview;
(function (overview) {
    window.addEventListener("load", init);
    let realmsList;
    let toObsfuscate;
    function init() {
        document.getElementsByTagName("h1")[0].innerText = "Welcome " + getCookie("name");
        if (!checkCredentials(false)) {
            window.location.replace("login");
            return;
        }
        document.getElementById("showAll").addEventListener("change", toggleVisibility);
        realmsList = document.getElementById("realmsList");
        createRealmsDisplay();
        document.getElementById("showAll").dispatchEvent(new Event("change"));
        toObsfuscate = document.getElementsByClassName("obfuscated");
        // setInterval(obfuscate, 100, toObsfuscate);
    }
    function createRealmsDisplay() {
        let data = getCredentials();
        data["command"] = "getWorlds";
        let result = sendPOSTRequest(data);
        if (result.servers && result.servers.length > 0) {
            result.servers = result.servers.sort(sortRealms);
            realmsList.innerHTML = "";
            for (let s of result.servers) {
                // console.log(s);
                createOneRealm(s, data.name);
            }
        }
        else {
            realmsList.innerHTML = "Nothing to see here. You don't seem to have";
        }
    }
    function createOneRealm(_server, ownerName) {
        let owner = _server.owner == ownerName;
        let imgURL = "";
        if (_server.state == "OPEN")
            imgURL = (owner && _server.daysLeft < 15) ? "./img/expires_soon_icon.png" : "./img/on_icon.png";
        if (_server.state == "CLOSED")
            imgURL = "./img/off_icon.png";
        if (_server.expired)
            imgURL = "./img/expired_icon.png";
        realmsList.innerHTML +=
            `<div class="realm ${owner ? "owned" : "notOwned"} ${_server.expired ? "expired" : ""}">
        <img src="${imgURL}" alt="${_server.expired ? "expired" : "active"}">
        <img src="https://crafatar.com/avatars/${_server.ownerUUID}?size=40&overlay" alt="">
        <span>${applyFormatingCodes(escapeHtml(_server.properties.name || ""))}</span>
        <span>${_server.minigameName ? "Minigame: " + escapeHtml(_server.minigameName) : applyFormatingCodes(escapeHtml(_server.properties.description || ""))}</span>
        <span>${escapeHtml(_server.owner)}</span>
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
    function toggleVisibility(_e) {
        let hideOthers = _e.target.checked;
        for (let elem of document.getElementsByClassName("notOwned")) {
            hideOthers ? elem.classList.add("hidden") : elem.classList.remove("hidden");
        }
    }
    function selectRealm(id) {
        setCookie("worldid", id.toString());
        window.location.replace("./overview");
    }
    overview.selectRealm = selectRealm;
    function leaveRealm(id) {
        let really = prompt(`If you really want to leave this realm, type "LEAVE" and click send.\nTo abort, type anything else.`);
        if (really != "LEAVE")
            return;
        console.log("Yes, really.");
        let data = getCredentials();
        data["command"] = "leaveRealm";
        data["world"] = id;
        let result = sendPOSTRequest(data);
    }
    overview.leaveRealm = leaveRealm;
})(overview || (overview = {}));
