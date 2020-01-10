var worldsPage;
(function (worldsPage) {
    window.addEventListener("load", init);
    let worldid;
    let server;
    let selectedSlot;
    function init() {
        worldid = checkWorldId();
        checkCredentials();
        getWorlds();
    }
    function getWorlds() {
        let data = getCredentials();
        data["command"] = "detail";
        data["world"] = worldid;
        let result = sendPOSTRequest(data);
        if (result.error)
            return;
        console.log(result);
        result.slots = new Map(result.slots);
        server = result;
        let slots = result.slots;
        let worlds = document.getElementById("worlds");
        worlds.innerHTML = "";
        for (let i = 1; i < slots.size + 1; i++) {
            worlds.innerHTML += `
      <div class="world-wrapper ${i == result.activeSlot ? "active" : ""}" id="world-${i}">
        <img src="${slots.get(i).templateImage ? "data:image/png;base64, " + slots.get(i).templateImage : "../img/placeholder.png"}" alt="" class="world-image">
        <span class="world-name">${slots.get(i).slotName || `World ${i}`}</span>
        <button disabled>Switch</button>
        <button onclick="worldsPage.showSettings(${i})" >World Settings</button>
        <button disabled>Replace World</button>
      </div>
      `;
        }
        worlds.innerHTML += `
    <div class="world-wrapper ${4 == result.activeSlot ? "active" : ""}" id="world-3">
      <img src="${result.minigameImage ? "data:image/png;base64, " + result.minigameImage : "../img/placeholder.png"}" alt="" class="world-image">
      <span class="world-name">${result.minigameName || "Minigame"}</span>
      <button disabled>Switch to temporary Minigame</button>
    </div>
    `;
    }
    function showSettings(slot) {
        if (!server)
            return;
        selectedSlot = slot;
        let slotOptions = server.slots.get(slot);
        document.getElementById("world-settings-wrapper").classList.remove("hidden");
        for (let setting in slotOptions) {
            let input = document.getElementById(setting);
            if (!input)
                continue;
            if (input.type == "checkbox") {
                input.checked = slotOptions[setting];
            }
            else {
                input.value = slotOptions[setting];
            }
        }
    }
    worldsPage.showSettings = showSettings;
    function saveWorldSettings() {
        let form = document.getElementById("world-settings");
        let data = getCredentials();
        data["command"] = "worldSettings";
        data["worldid"] = worldid;
        data["slot"] = selectedSlot;
        data["newSettings"] = {};
        let formdata = new FormData(form);
        for (let e of formdata.entries()) {
            if (e[1] == "false" || e[1] == "true") {
                data.newSettings[e[0]] = e[1] == "true";
            }
            else if (!isNaN(Number(e[1]))) {
                data.newSettings[e[0]] = Number(e[1]);
            }
            else {
                data.newSettings[e[0]] = e[1];
            }
        }
        console.log(data);
    }
    worldsPage.saveWorldSettings = saveWorldSettings;
    function cancelWorldSettings() {
        document.getElementById("world-settings-wrapper").classList.add("hidden");
    }
    worldsPage.cancelWorldSettings = cancelWorldSettings;
})(worldsPage || (worldsPage = {}));
