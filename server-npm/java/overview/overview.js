var overview;
(function (overview) {
    window.addEventListener("load", init);
    let generalDiv;
    let playersDiv;
    let worldsDiv;
    let playerListDiv;
    function init() {
        // checkWorldId();
        // checkCredentials();
        initReferences();
        createOverview();
    }
    function initReferences() {
        generalDiv = document.getElementById("general");
        playersDiv = document.getElementById("players");
        worldsDiv = document.getElementById("worlds");
        playerListDiv = document.getElementById("playerList");
    }
    function createOverview() {
        //TODO save/load using cookies to make it display faster
        let data = getCredentials();
        data["command"] = "detail";
        data["world"] = getCookie("worldid");
        let result = sendPOSTRequest(data);
        generalOverview(result);
        worldOverview(result);
        playerOverview(result.players);
        setInterval(updatePlayers, 1000 * 15);
    }
    function generalOverview(r) {
        generalDiv.innerHTML = `
      <img src="${r.expired ? "" : ""}" alt="${r.expired ? "expired" : "active"}">
      <span id="realmName">${r.properties.name}</span>
      <span id="realmDescription">${r.properties.description}</span>
      <span id="realmID">${r.id}</span>
      <span id="realmSubscriptionStatus">${formatDays(r.daysLeft)}</span>
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
        r.slots = new Map(r.slots);
        let active = r.slots.get(r.activeSlot);
        worldsDiv.innerHTML = `
    <img src=${active.templateImage ? "data:image/png;base64, " + active.templateImage : "../img/placeholder.png"} alt="">
    <span>${active.slotName || "World " + r.activeSlot}</span>
    <span></span>
    `;
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
            <img src="https://crafatar.com/avatars/${players[i].uuid}?size=40&overlay" alt="" width="40px" height="40px">
            <span>${players[i].name || ""}</span>
          </div>`;
            }
        }
        playersDiv.querySelector("span").innerText = `Currently online: ${online}/10`;
    }
    function updatePlayers() {
        let data = getCredentials();
        data["command"] = "getPlayers";
        data["world"] = getCookie("worldid");
        let result = sendPOSTRequest(data);
        playerOverview(result);
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
})(overview || (overview = {}));
