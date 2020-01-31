var realmsList;
(function (realmsList_1) {
    window.addEventListener("load", init);
    let realmsList;
    let realms = [];
    function init() {
        document.getElementsByTagName("h1")[0].innerText = "Welcome " + getCookie("name");
        if (!checkCredentials()) {
            return;
        }
        document.getElementById("showAll").addEventListener("change", toggleVisibility);
        realmsList = document.getElementById("realmsList");
        createRealmsDisplay();
        document.getElementById("showAll").dispatchEvent(new Event("change"));
        obfuscate();
        document.getElementById("search").addEventListener("input", search);
    }
    function createRealmsDisplay() {
        if (getCookie("realms")) {
            realms = JSON.parse(getPerformanceCookie("realms"));
        }
        else {
            let data = getCredentials();
            data["command"] = "getWorlds";
            let result = sendPOSTRequest(data);
            if (result.servers && result.servers.length > 0) {
                realms = result.servers;
                setPerformanceCookie("realms", JSON.stringify(realms), false);
            }
        }
        if (realms && realms.length > 0) {
            realms = realms.sort(sortRealms);
            realmsList.innerHTML = "";
            let ownerName = getCookie("name");
            for (let s of realms) {
                // console.log(s);
                createOneRealm(s, ownerName);
            }
        }
        else {
            realmsList.innerHTML = "<span>No Realm found.</span>";
        }
    }
    function createOneRealm(_server, ownerName) {
        let owner = _server.owner == ownerName;
        let imgURL = "";
        if (_server.state == "OPEN")
            imgURL = (owner && _server.daysLeft < 15) ? "../img/expires_soon_icon.png" : "../img/on_icon.png";
        if (_server.state == "CLOSED")
            imgURL = "../img/off_icon.png";
        if (_server.expired)
            imgURL = "../img/expired_icon.png";
        realmsList.innerHTML +=
            `<div class="realm ${owner ? "owned" : "notOwned"} ${_server.expired ? "expired" : ""}" id="${_server.id}">
        <img class="status" src="${imgURL}" alt="${_server.expired ? "expired" : "active"}">
        <img class="avatar" src="https://crafatar.com/avatars/${_server.ownerUUID}?size=48&overlay" alt="">
        <span>${applyFormatingCodes(escapeHtml(_server.properties.name || "\u00A0"))}</span>
        <span>${_server.minigameName ? "<span class='gold'>Minigame:</span> " + escapeHtml(_server.minigameName) : applyFormatingCodes(escapeHtml(_server.properties.description || "\u00A0"))}</span>
        <span>${escapeHtml(_server.owner) || "\u00A0"}</span>
        <button onclick="${owner ? "realmsList.selectRealm(" + _server.id + ")" : "realmsList.leaveRealm(" + _server.id + ")"}" ${owner ? "" : "disabled"}>${owner ? "Edit" : "Leave"}</button>
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
        if (a.owner > b.owner)
            return -1;
        if (a.owner < b.owner)
            return 1;
        return 0;
    }
    function toggleVisibility(_e) {
        let hideOthers = _e.target.checked;
        for (let elem of document.getElementsByClassName("notOwned")) {
            hideOthers ? elem.classList.add("hidden") : elem.classList.remove("hidden");
        }
    }
    function selectRealm(id) {
        setCookie("worldid", id.toString());
        window.location.replace("../overview");
    }
    realmsList_1.selectRealm = selectRealm;
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
    realmsList_1.leaveRealm = leaveRealm;
    function search(_e) {
        let searchterm = _e.target.value.toLowerCase();
        for (let s of realms) {
            let shouldBeDisplayed = false;
            if (s.properties.description)
                if (s.properties.description.toLowerCase().includes(searchterm))
                    shouldBeDisplayed = true;
            if (s.properties.name)
                if (s.properties.name.toLowerCase().includes(searchterm))
                    shouldBeDisplayed = true;
            if (searchterm == "" || s.owner.toLowerCase().includes(searchterm) || shouldBeDisplayed) {
                document.getElementById(s.id.toString()).classList.remove("hidden");
            }
            else {
                document.getElementById(s.id.toString()).classList.add("hidden");
            }
        }
    }
    realmsList_1.search = search;
})(realmsList || (realmsList = {}));
