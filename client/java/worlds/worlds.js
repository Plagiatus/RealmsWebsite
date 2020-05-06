var worldsPage;
(function (worldsPage) {
    window.addEventListener("load", init);
    let selectedSlot;
    let backupList;
    async function init() {
        checkWorldId();
        checkCredentials();
        await getWorlds();
        worldsPage.switchButtons = document.getElementsByClassName("switch-slot-btn");
        handleSwitchButtons(false);
        backupList = document.querySelector("ul#backup-list");
        for (let rep of document.querySelectorAll(".replacement")) {
            rep.addEventListener("click", replacementClick);
        }
    }
    async function getWorlds() {
        let tmp = getPerformanceCookie(worldName());
        if (tmp) {
            worldsPage.server = JSON.parse(tmp);
        }
        else {
            worldsPage.server = await detailRequest(null);
        }
        selectedSlot = worldsPage.server.activeSlot;
        let slots = worldsPage.server.slots;
        let worlds = document.getElementById("worlds");
        worlds.innerHTML = "";
        for (let slot in slots) {
            let slotNumber = Number(slot);
            if (slotNumber == 4)
                continue;
            worlds.innerHTML += `
    <div class="world-wrapper ${slotNumber == worldsPage.server.activeSlot && !worldsPage.server.minigameId ? "active" : ""}" id="world-${slotNumber}">
      <img src="${slots[slot].templateImage ? "data:image/png;base64, " + slots[slot].templateImage : "../img/placeholder.png"}" alt="" class="world-image">
      <span class="world-name">${slots[slot].slotName || `World ${slotNumber}`}</span>
      <button class="switch-slot-btn" slot="${slotNumber}">Switch</button>
      <button class="world-settings-btn" onclick="worldsPage.showSettings(${slotNumber})">World Settings</button>
      <button class="world-reset-btn" onclick="worldsPage.showReplaceWorld(${slotNumber})">Replace World</button>
    </div>
    `;
        }
        // for (let i: number = 1; i < slots.size + 1; i++) {
        //   }
        worlds.innerHTML += `
    <div class="world-wrapper ${worldsPage.server.minigameId ? "active" : ""}" id="world-minigame">
      <img src="${worldsPage.server.minigameImage ? "data:image/png;base64, " + worldsPage.server.minigameImage : "../img/placeholder.png"}" alt="" class="world-image">
      <span class="world-name">${worldsPage.server.minigameName || "Minigame"}</span>
      <button id="show-minigames-btn" onclick="worldsPage.showMinigames()">${worldsPage.server.minigameId ? "Switch Minigame" : "Switch to temporary Minigame"}</button>
    </div>
    `;
    }
    function showSettings(slot) {
        if (!worldsPage.server)
            return;
        closeAll();
        selectedSlot = slot;
        document.querySelector("#world-" + slot + " .world-settings-btn").disabled = true;
        let slotOptions = worldsPage.server.slots[slot];
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
        window.scrollTo(0, document.getElementById("world-settings-wrapper").offsetTop);
    }
    worldsPage.showSettings = showSettings;
    function saveWorldSettings() {
        let form = document.getElementById("world-settings");
        let data = getCredentials();
        data["command"] = "worldSettings";
        data["world"] = worldid;
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
        sendPOSTRequest(data, () => {
            // update saved server and html display
            let slotOptions = worldsPage.server.slots[selectedSlot];
            let settings = JSON.parse(data.newSettings);
            for (let setting in settings) {
                slotOptions[setting] = settings[setting];
            }
            document.getElementById("world-" + selectedSlot).querySelector(".world-name").innerText = slotOptions.slotName != "" ? slotOptions.slotName : `World ${selectedSlot}`;
            showSettings(selectedSlot);
            setPerformanceCookie(worldName(), JSON.stringify(worldsPage.server));
        });
    }
    worldsPage.saveWorldSettings = saveWorldSettings;
    function switchTo(slot) {
        if (!worldsPage.server)
            return;
        closeAll();
        handleSwitchButtons(true);
        let data = getCredentials();
        data["command"] = "changeSlot";
        data["world"] = worldid;
        data["slot"] = slot;
        sendPOSTRequest(data, null)
            .then((result) => {
            worldsPage.server = result;
            if (slot != 4)
                document.querySelector("#world-" + slot + " .switch-slot-btn").disabled = true;
            document.getElementById("world-minigame").querySelector(".world-name").innerText = "Minigame";
            document.getElementById("world-minigame").querySelector("img").src = "data:image/png;base64, " + worldsPage.server.minigameImage;
            document.getElementById("worlds").querySelector(".active").classList.remove("active");
            document.getElementById("world-" + slot).classList.add("active");
            document.getElementById("show-minigames-btn").innerText = "Switch to temporary Minigame";
            setPerformanceCookie(worldName(), JSON.stringify(worldsPage.server));
        })
            .finally(() => {
            handleSwitchButtons(false);
        });
    }
    worldsPage.switchTo = switchTo;
    function showReplaceWorld(slot) {
        closeAll();
        document.querySelector(`#world-${slot} > .world-reset-btn`).disabled = true;
        document.getElementById("replace-header").innerText = "Replacing World in \"" + (worldsPage.server.slots[slot].slotName || "World " + slot) + "\" with...";
        document.getElementById("world-reset").classList.remove("hidden");
        selectedSlot = slot;
    }
    worldsPage.showReplaceWorld = showReplaceWorld;
    function replacementClick(_e) {
        let target = _e.currentTarget;
        if (target.classList.contains("disabled"))
            return;
        for (let s in worldsPage) {
            if (s == target.id) {
                worldsPage[s]();
                return;
            }
        }
    }
    function closeAll(clearSlot = true) {
        let buttons = Array.from(document.getElementsByClassName("world-settings-btn"));
        buttons = buttons.concat(Array.from(document.getElementsByClassName("world-reset-btn")));
        buttons.push(document.getElementById("show-minigames-btn"));
        for (let btn of buttons) {
            if (btn)
                btn.disabled = false;
        }
        if (clearSlot)
            selectedSlot = null;
        let allDivs = document.getElementsByClassName("settings-div");
        for (let div of allDivs) {
            div.classList.add("hidden");
        }
    }
    worldsPage.closeAll = closeAll;
    function newWorld() {
        closeAll(false);
        document.getElementById("new-world").classList.remove("hidden");
    }
    worldsPage.newWorld = newWorld;
    function handleSwitchButtons(disable) {
        if (disable) {
            for (let btn of worldsPage.switchButtons) {
                btn.disabled = true;
                btn.innerText = "Switching...";
            }
            return;
        }
        for (let btn of worldsPage.switchButtons) {
            btn.disabled = false;
            btn.innerText = "Switch";
            let slot = btn.getAttribute("slot");
            btn.setAttribute("onclick", `worldsPage.switchTo(${slot})`);
            if (slot == worldsPage.server.activeSlot.toString() && !worldsPage.server.minigameId) {
                btn.innerText = "Backups";
                btn.setAttribute("onclick", `worldsPage.showBackups(${slot})`);
            }
        }
    }
    worldsPage.handleSwitchButtons = handleSwitchButtons;
    function makeNewWorld() {
        let btn = document.getElementById("make-new-world-btn");
        let seed = document.getElementById("seed").value;
        let levelType = document.getElementById("leveltype").value;
        let genStructures = document.getElementById("genStructures").checked;
        if (seed == "") {
            seed = Math.floor(Math.random() * Math.pow(2, 31) - 1).toString();
        }
        btn.disabled = true;
        let data = getCredentials();
        data["command"] = "resetWorld";
        data["world"] = worldid;
        data["slot"] = selectedSlot;
        data["seed"] = seed;
        data["levelType"] = levelType;
        data["genStruct"] = genStructures;
        sendPOSTRequest(data, null)
            .then(() => {
            closeAll();
        })
            .finally(() => {
            btn.disabled = false;
        });
    }
    worldsPage.makeNewWorld = makeNewWorld;
    function showBackups(_slot) {
        selectedSlot = _slot;
        document.getElementById("backup-download-a").innerText = "";
        document.getElementById("backup-wrapper").classList.remove("hidden");
        backupList.innerHTML = "<span>Loading...</span>";
        let data = getCredentials();
        data["command"] = "getBackups";
        data["world"] = worldid;
        sendPOSTRequest(data, (result) => {
            let backups = result.backups;
            backupList.innerHTML = "";
            for (let backup of backups) {
                backupList.innerHTML += `<li>
        <span id="backup-name">Backup</span>
        <span id="backup-date">${timeDisplay(backup.lastModifiedDate)}</span>
        <button onclick="worldsPage.restoreBackup('${backup.backupId}')" disabled>Restore</button>
      </li>`;
            }
        });
        function timeDisplay(date) {
            let modified = new Date(date);
            let result = modified.toLocaleDateString() + " ";
            let seconds = (Date.now() - modified.valueOf()) / 1000;
            let minutes = seconds / 60;
            let hours = minutes / 60;
            let days = hours / 24;
            if (days > 0) {
                result += `(${Math.floor(days)} days ago)`;
            }
            else if (hours > 0) {
                result += `(${Math.floor(hours)} hours ago)`;
            }
            else if (minutes > 0) {
                result += `(${Math.floor(minutes)} minutes ago)`;
            }
            else if (seconds > 0) {
                result += `(${Math.floor(seconds)} seconds ago)`;
            }
            else {
                result += `(just now)`;
            }
            return result;
        }
    }
    worldsPage.showBackups = showBackups;
    function downloadBackup() {
        let btn = document.getElementById("backup-download-btn");
        let a = document.getElementById("backup-download-a");
        a.innerText = "";
        a.setAttribute("href", "");
        btn.disabled = true;
        let data = getCredentials();
        data["command"] = "downloadBackup";
        data["world"] = worldid;
        data["slot"] = selectedSlot;
        sendPOSTRequest(data, (result) => {
            a.innerText = "Click here to download";
            a.setAttribute("href", JSON.parse(result).downloadLink);
            // Object.assign(document.createElement('a'), { target: '_blank', href: 'https://google.com'}).click();
            // window.open(JSON.parse(result).downloadLink, "_blank");
        }).finally(() => { btn.disabled = false; });
    }
    worldsPage.downloadBackup = downloadBackup;
})(worldsPage || (worldsPage = {}));
