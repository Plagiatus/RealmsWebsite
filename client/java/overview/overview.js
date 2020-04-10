var overview;
(function (overview) {
    window.addEventListener("load", init);
    let generalDiv;
    let playersDiv;
    let worldsDiv;
    let playerListDiv;
    let realm;
    function init() {
        checkWorldId();
        checkCredentials();
        initReferences();
        createOverview();
        obfuscate();
    }
    function initReferences() {
        generalDiv = document.getElementById("general");
        playersDiv = document.getElementById("players");
        worldsDiv = document.getElementById("worlds");
        playerListDiv = document.getElementById("playerList");
    }
    function createOverview() {
        let tmp = getPerformanceCookie(worldName());
        if (tmp) {
            realm = JSON.parse(tmp);
        }
        else {
            detailRequest((result) => {
                realm = result;
            });
        }
        generalOverview(realm);
        worldOverview(realm);
        setInterval(updatePlayers, 1000 * 15);
        playerOverview(realm.players);
    }
    function generalOverview(r) {
        let imgURL = "";
        if (r.state == "OPEN")
            imgURL = r.daysLeft > 15 ? "../img/on_icon.png" : "../img/expires_soon_icon.png";
        if (r.state == "CLOSED")
            imgURL = "../img/off_icon.png";
        if (r.expired)
            imgURL = "../img/expired_icon.png";
        generalDiv.innerHTML = `
      <img src="${imgURL}" alt="${r.expired ? "expired" : "active"}">
      <span id="realmName">${applyFormatingCodes(escapeHtml(r.properties.name))}</span><br>
      <span id="realmDescription">${applyFormatingCodes(escapeHtml(r.properties.description))}</span><br>
      <span id="realmID">Id: ${r.id}</span><br>
      <span id="realmSubscriptionStatus">${formatDays(r.daysLeft)}</span><br>
    `;
    }
    function formatDays(daysLeft) {
        if (daysLeft <= 0) {
            return "Susbscription ran out.";
        }
        let now = new Date();
        let end = new Date(Date.now() + 1000 * 60 * 60 * 24 * daysLeft);
        let year = end.getFullYear() - now.getFullYear();
        let months = end.getMonth() - now.getMonth();
        let days = end.getDate() - now.getDate();
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
    function worldOverview(r) {
        let active = r.slots[r.activeSlot];
        worldsDiv.innerHTML = "";
        if (r.minigameId) {
            worldsDiv.innerHTML += `
      <span>Selected Minigame</span>
      <img src="${r.minigameImage ? "data:image/png;base64, " + r.minigameImage : "../img/placeholder.png"}" alt="">
      <span>${r.minigameName || "World " + r.activeSlot}</span>
      `;
        }
        else {
            worldsDiv.innerHTML += `
      <span>Selected Slot</span>
      <img src="${active.templateImage ? "data:image/png;base64, " + active.templateImage : ("../img/placeholder.png")}" alt="">
      <span>${active.slotName || "World " + r.activeSlot}</span>
      `;
        }
    }
    function playerOverview(players) {
        players.sort(sortPlayers);
        playerListDiv.innerHTML = players.length > 0 ? "" : "<span>Nobody is online.</span>";
        let online = 0;
        for (let i = 0; i < players.length; i++) {
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
        data["world"] = localStorage.getItem("worldid");
        sendPOSTRequest(data, (result) => {
            playerOverview(result);
        });
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
    function removeFormatCodes(s) {
        return s.replace(/§./g, "");
    }
})(overview || (overview = {}));
