var realmsList;
(function (realmsList_1) {
    window.addEventListener("load", init);
    let realmsList;
    let realms = [];
    async function init() {
        document.getElementsByTagName("h1")[0].innerText = "Welcome " + localStorage.getItem("name");
        if (!await checkCredentials()) {
            return;
        }
        document.getElementById("showAll").addEventListener("change", toggleVisibility);
        realmsList = document.getElementById("realmsList");
        await createRealmsDisplay();
        document.getElementById("showAll").dispatchEvent(new Event("change"));
        document.getElementById("search").addEventListener("input", search);
        getInvites();
        obfuscate();
    }
    async function createRealmsDisplay() {
        let tmp = getPerformanceCookie("realms");
        if (tmp) {
            realms = JSON.parse(tmp);
        }
        else {
            let data = getCredentials();
            data["command"] = "getWorlds";
            let result = await sendPOSTRequest(data, null);
            if (result.servers && result.servers.length > 0) {
                realms = result.servers;
                setPerformanceCookie("realms", JSON.stringify(realms));
            }
        }
        if (realms && realms.length > 0) {
            realms = realms.sort(sortRealms);
            realmsList.innerHTML = "";
            let ownerName = localStorage.getItem("name");
            for (let s of realms) {
                // console.log(s);
                createOneRealm(s, ownerName);
            }
        }
        else {
            realmsList.innerHTML = "<span style='margin-left: 10px' class='red'>No Realm found.</span>";
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
        let owner = localStorage.getItem("name");
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
        localStorage.setItem("worldid", id.toString());
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
        sendPOSTRequest(data, null);
        //TODO: remove realm from list
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
    function getInvites() {
        let img = document.getElementById("inviteStatus");
        let data = getCredentials();
        data["command"] = "getInvites";
        sendPOSTRequest(data, (result) => {
            if (result.invites.length <= 0) {
                document.getElementById("invitesList").querySelector("span").innerText = "No invitations.";
                return;
            }
            img.src = "../img/invites_pending.gif";
            img.title = `You have ${result.invites.length} new invite${result.invites.length != 1 ? "s" : ""}.`;
            displayInvites(result.invites);
        });
    }
    function displayInvites(invites) {
        let invitesList = document.getElementById("invitesList");
        invitesList.innerHTML = "";
        document.getElementById("invites").classList.remove("hidden");
        for (let invite of invites) {
            invitesList.innerHTML +=
                `<div class="invite" id="${invite.invitationId}">
          <img class="avatar" src="https://crafatar.com/avatars/${invite.worldOwnerUuid}?size=48&overlay" alt="">
          <span>${applyFormatingCodes(escapeHtml(invite.worldName || "\u00A0"))}</span>
          <span>${applyFormatingCodes(escapeHtml(invite.worldDescription || "\u00A0"))}</span>
          <span>${escapeHtml(invite.worldOwnerName) || "\u00A0"}</span>
          <span>${new Date(invite.date).toLocaleString()}</span>
          <button class="join" onclick="realmsList.changeInvite(${invite.invitationId},true)">Accept</button>
          <button class="deny" onclick="realmsList.changeInvite(${invite.invitationId},false)">Deny</button>
        </div>`;
        }
    }
    function changeInvite(id, accept) {
        let data = getCredentials();
        data["command"] = "changeInvite";
        data["invite"] = id;
        data["accept"] = accept;
        sendPOSTRequest(data, (res) => {
            console.log(res);
            document.getElementById(id.toString()).remove();
            localStorage.removeItem(worldName());
        });
    }
    realmsList_1.changeInvite = changeInvite;
})(realmsList || (realmsList = {}));
