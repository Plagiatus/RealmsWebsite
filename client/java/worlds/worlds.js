var worldsPage;
(function (worldsPage) {
    window.addEventListener("load", init);
    let worldid;
    let server;
    let selectedSlot;
    let switchButtons;
    function init() {
        worldid = checkWorldId();
        checkCredentials();
        getWorlds();
        switchButtons = document.getElementsByClassName("switch-slot-btn");
        // settingsButtons = <HTMLCollectionOf<HTMLButtonElement>>document.getElementsByClassName("world-settings-btn");
    }
    function getWorlds() {
        let data = getCredentials();
        data["command"] = "detail";
        data["world"] = worldid;
        let result = sendPOSTRequest(data);
        if (result.error)
            return;
        console.log(result);
        server = fixSlots(result);
        let slots = result.slots;
        let worlds = document.getElementById("worlds");
        worlds.innerHTML = "";
        for (let i = 1; i < slots.size + 1; i++) {
            worlds.innerHTML += `
      <div class="world-wrapper ${i == result.activeSlot ? "active" : ""}" id="world-${i}">
        <img src="${slots.get(i).templateImage ? "data:image/png;base64, " + slots.get(i).templateImage : "../img/placeholder.png"}" alt="" class="world-image">
        <span class="world-name">${slots.get(i).slotName || `World ${i}`}</span>
        <button class="switch-slot-btn" onclick="worldsPage.switchTo(${i})" ${i == result.activeSlot ? "disabled" : ""}>Switch</button>
        <button class="world-settings-btn" onclick="worldsPage.showSettings(${i})" >World Settings</button>
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
        if (selectedSlot)
            document.querySelector("#world-" + selectedSlot + " .world-settings-btn").disabled = false;
        selectedSlot = slot;
        document.querySelector("#world-" + slot + " .world-settings-btn").disabled = true;
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
        data.newSettings = JSON.stringify(data.newSettings);
        console.log(data);
    }
    worldsPage.saveWorldSettings = saveWorldSettings;
    function cancelWorldSettings() {
        document.getElementById("world-settings-wrapper").classList.add("hidden");
        document.querySelector("#world-" + selectedSlot + " .world-settings-btn").disabled = false;
    }
    worldsPage.cancelWorldSettings = cancelWorldSettings;
    function switchTo(slot) {
        if (!server)
            return;
        for (let btn of switchButtons) {
            btn.disabled = true;
            btn.innerText = "Switching...";
        }
        let data = getCredentials();
        data["command"] = "changeSlot";
        data["world"] = worldid;
        data["slot"] = slot;
        let result = sendPOSTRequest(data);
        for (let btn of switchButtons) {
            btn.disabled = false;
            btn.innerText = "Switch";
        }
        if (result.error) {
            document.querySelector("#world-" + server.activeSlot + " .switch-slot-btn").disabled = true;
            return;
        }
        server = fixSlots(result);
        document.querySelector("#world-" + server.activeSlot + " .switch-slot-btn").disabled = true;
        document.querySelector(".active").classList.remove("active");
        document.getElementById("world-" + slot).classList.add("active");
    }
    worldsPage.switchTo = switchTo;
})(worldsPage || (worldsPage = {}));
