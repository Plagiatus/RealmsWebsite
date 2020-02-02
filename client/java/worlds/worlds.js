var worldsPage;
(function (worldsPage) {
    window.addEventListener("load", init);
    let server;
    let selectedSlot;
    let switchButtons;
    let templates;
    let selectedTemplateDiv;
    let templateWrapperDiv;
    let templateFilter;
    let templatePlayerFilter;
    function init() {
        checkWorldId();
        checkCredentials();
        getWorlds();
        switchButtons = document.getElementsByClassName("switch-slot-btn");
        selectedTemplateDiv = document.getElementById("selected-template");
        templateWrapperDiv = document.getElementById("template-wrapper");
        templateFilter = document.getElementById("template-search");
        templateFilter.addEventListener("input", filterTemplates);
        templatePlayerFilter = document.getElementById("player-amount");
        templatePlayerFilter.addEventListener("input", filterTemplates);
        window.addEventListener("scroll", moveSelectedTemplate);
        for (let rep of document.querySelectorAll(".replacement")) {
            rep.addEventListener("click", replacementClick);
        }
    }
    function getWorlds() {
        if (getCookie(worldName())) {
            server = JSON.parse(getPerformanceCookie(worldName()));
        }
        else {
            let data = getCredentials();
            data["command"] = "detail";
            data["world"] = worldid;
            let result = sendPOSTRequest(data);
            if (result.error)
                return;
            console.log(result);
            server = result;
            setPerformanceCookie(worldName(), JSON.stringify(server));
        }
        let slots = server.slots;
        let worlds = document.getElementById("worlds");
        worlds.innerHTML = "";
        for (let slot in slots) {
            let slotNumber = Number(slot);
            if (slotNumber == 4)
                continue;
            worlds.innerHTML += `
    <div class="world-wrapper ${slotNumber == server.activeSlot && !server.minigameId ? "active" : ""}" id="world-${slotNumber}">
      <img src="${slots[slot].templateImage ? "data:image/png;base64, " + slots[slot].templateImage : "../img/placeholder.png"}" alt="" class="world-image">
      <span class="world-name">${slots[slot].slotName || `World ${slotNumber}`}</span>
      <button class="switch-slot-btn" onclick="worldsPage.switchTo(${slotNumber})" ${slotNumber == server.activeSlot && !server.minigameId ? "disabled" : ""}>Switch</button>
      <button class="world-settings-btn" onclick="worldsPage.showSettings(${slotNumber})">World Settings</button>
      <button class="world-reset-btn" onclick="worldsPage.showReplaceWorld(${slotNumber})">Replace World</button>
    </div>
    `;
        }
        // for (let i: number = 1; i < slots.size + 1; i++) {
        //   }
        worlds.innerHTML += `
    <div class="world-wrapper ${server.minigameId ? "active" : ""}" id="world-minigame">
      <img src="${server.minigameImage ? "data:image/png;base64, " + server.minigameImage : "../img/placeholder.png"}" alt="" class="world-image">
      <span class="world-name">${server.minigameName || "Minigame"}</span>
      <button id="show-minigames-btn" onclick="worldsPage.showMinigames()">${server.minigameId ? "Switch Minigame" : "Switch to temporary Minigame"}</button>
    </div>
    `;
    }
    function showSettings(slot) {
        if (!server)
            return;
        closeAll();
        selectedSlot = slot;
        document.querySelector("#world-" + slot + " .world-settings-btn").disabled = true;
        let slotOptions = server.slots[slot];
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
        let result = sendPOSTRequest(data);
        if (result.error)
            return;
        // update saved server and html display
        let slotOptions = server.slots[selectedSlot];
        let settings = JSON.parse(data.newSettings);
        for (let setting in settings) {
            slotOptions[setting] = settings[setting];
        }
        document.getElementById("world-" + selectedSlot).querySelector(".world-name").innerText = slotOptions.slotName != "" ? slotOptions.slotName : `World ${selectedSlot}`;
        showSettings(selectedSlot);
        setPerformanceCookie(worldName(), JSON.stringify(server));
    }
    worldsPage.saveWorldSettings = saveWorldSettings;
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
        server = result;
        if (slot != 4)
            document.querySelector("#world-" + slot + " .switch-slot-btn").disabled = true;
        document.getElementById("world-minigame").querySelector(".world-name").innerText = "Minigame";
        document.getElementById("world-minigame").querySelector("img").src = "data:image/png;base64, " + server.minigameImage;
        document.getElementById("worlds").querySelector(".active").classList.remove("active");
        document.getElementById("world-" + slot).classList.add("active");
        document.getElementById("show-minigames-btn").innerText = "Switch to temporary Minigame";
        setPerformanceCookie(worldName(), JSON.stringify(server));
    }
    worldsPage.switchTo = switchTo;
    function showReplaceWorld(slot) {
        closeAll();
        document.querySelector(`#world-${slot} > .world-reset-btn`).disabled = true;
        document.getElementById("replace-header").innerText = "Replacing World in \"" + (server.slots[slot].slotName || "World " + slot) + "\" with...";
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
    function showMinigames() {
        selectedSlot = 4;
        getTemplates("MINIGAMES");
    }
    worldsPage.showMinigames = showMinigames;
    function showWorldTemplate() {
        getTemplates("WORLD_TEMPLATES");
    }
    worldsPage.showWorldTemplate = showWorldTemplate;
    function showInspiration() {
        getTemplates("INSPIRATION");
    }
    worldsPage.showInspiration = showInspiration;
    function showExperience() {
        getTemplates("EXPERIENCES");
    }
    worldsPage.showExperience = showExperience;
    function showAdventure() {
        getTemplates("ADVENTURES");
    }
    worldsPage.showAdventure = showAdventure;
    function getTemplates(type) {
        closeAll(false);
        if (selectedSlot == 4)
            document.querySelector("#show-minigames-btn").disabled = true;
        templateWrapperDiv.classList.remove("hidden");
        document.getElementById("template-type").innerText = type;
        selectedTemplateDiv.innerHTML = "<span>Nothing selected</span>";
        document.getElementById("templates-wrapper").innerHTML = "<span>Loading...</span>";
        let data = getCredentials();
        data["command"] = "templates";
        data["type"] = type;
        let result = sendPOSTRequest(data);
        if (result.error)
            return;
        displayTemplates(result);
    }
    function displayTemplates(_templates) {
        let templateDiv = document.getElementById("templates-wrapper");
        if (!_templates || _templates.length <= 0) {
            templateDiv.innerHTML = "<span>There are no templates in this category.</span>";
            templates = [];
            return;
        }
        templates = _templates;
        document.getElementById("template-type").innerText = _templates[0].type;
        templateDiv.innerHTML = "";
        for (let temp of _templates) {
            let div = document.createElement("div");
            div.classList.add("template");
            div.id = "template-" + temp.id;
            div.innerHTML = `
        <img src="data:image/png;base64, ${temp.image}" alt="">
        <span class="template-name">${temp.name}</span>
        <span class="template-author">By ${temp.author}</span>
        ${temp.recommendedPlayers ? `<span class="template-players">${temp.recommendedPlayers}</span>` : ""}
      `;
            templateDiv.appendChild(div);
            div.addEventListener("click", selectTemplate);
            let players = getRecommendedPlayerNumbers(temp.recommendedPlayers);
            temp.playerMin = players[0];
            temp.playerMax = players[1];
        }
        let span = document.createElement("span");
        span.innerText = "No templates match your search.";
        span.classList.add("hidden");
        span.id = "nothing-found";
        templateDiv.appendChild(span);
    }
    function filterTemplates(event) {
        if (!templates || templates.length <= 0)
            return;
        let searchTerm = templateFilter.value;
        let playerAmount = Number(templatePlayerFilter.value);
        let found = false;
        for (let temp of templates) {
            if ((searchTerm == "" || temp.name.toLowerCase().includes(searchTerm) || temp.author.toLowerCase().includes(searchTerm))
                && (playerAmount == 0 || (playerAmount >= temp.playerMin && playerAmount <= temp.playerMax))) {
                document.getElementById("template-" + temp.id).classList.remove("hidden");
                found = true;
            }
            else {
                document.getElementById("template-" + temp.id).classList.add("hidden");
            }
        }
        if (found) {
            document.getElementById("nothing-found").classList.add("hidden");
        }
        else {
            document.getElementById("nothing-found").classList.remove("hidden");
        }
    }
    worldsPage.filterTemplates = filterTemplates;
    function selectTemplate(event) {
        let id = Number(event.currentTarget.id.split("-")[1]);
        let selectedTemplate = templates.find(tmp => tmp.id == id);
        let youtubeID = "";
        if (selectedTemplate.trailer.includes("youtube.com")) {
            youtubeID = selectedTemplate.trailer.split("v=")[1];
        }
        else if (selectedTemplate.trailer.includes("youtu.be")) {
            youtubeID = selectedTemplate.trailer.split("be/")[1];
        }
        selectedTemplateDiv.innerHTML = `
      <img src="data:image/png;base64, ${selectedTemplate.image}" alt="">
      <span class="template-version">${selectedTemplate.version}</span>
      <span class="template-name">${selectedTemplate.name}</span>
      <span class="template-author">By ${selectedTemplate.author}</span>
      ${selectedTemplate.recommendedPlayers ? `<span class="template-players">${selectedTemplate.recommendedPlayers}</span>` : ""}`;
        if (selectedTemplate && selectedTemplate.trailer != "") {
            selectedTemplateDiv.innerHTML += `<iframe class="template-trailer" src="https://www.youtube.com/embed/${youtubeID}"></iframe>`;
        }
        if (selectedTemplate.link && selectedTemplate.link != "") {
            selectedTemplateDiv.innerHTML += `<a class="template-link" href="${selectedTemplate.link}">Creator Website</a>`;
        }
        selectedTemplateDiv.innerHTML += `<button class="template-confirm-button" id="template-confirm-button" onclick="worldsPage.activateTemplate(${id})">Select</button>`;
        // window.scrollTo(0, selectedTemplateDiv.offsetTop);
        let previousActiveElement = document.getElementById("templates-wrapper").querySelector(".active");
        if (previousActiveElement)
            previousActiveElement.classList.remove("active");
        event.currentTarget.classList.add("active");
    }
    worldsPage.selectTemplate = selectTemplate;
    function activateTemplate(id) {
        document.getElementById("template-confirm-button").disabled = true;
        if (selectedSlot != 4 && selectedSlot != server.activeSlot) {
            switchTo(selectedSlot);
        }
        let data = getCredentials();
        data["command"] = selectedSlot == 4 ? "setMinigame" : "setTemplate";
        data["world"] = worldid;
        data["id"] = id;
        let result = sendPOSTRequest(data);
        document.getElementById("template-confirm-button").disabled = false;
        if (result.error)
            return;
        let selectedTemplate = templates.find(tmp => tmp.id == id);
        if (selectedSlot == 4) {
            document.getElementById("worlds").querySelector(".active").classList.remove("active");
            document.getElementById("world-minigame").classList.add("active");
            document.getElementById("show-minigames-btn").innerText = "Switch Minigame";
            let minigameContainer = document.getElementById("world-minigame");
            minigameContainer.querySelector(".world-name").innerText = selectedTemplate.name;
            minigameContainer.querySelector("img").src = "data:image/png;base64, " + selectedTemplate.image;
            server.minigameImage = selectedTemplate.image;
            server.minigameName = selectedTemplate.name;
            server.minigameId = id;
            for (let btn of switchButtons) {
                btn.disabled = false;
                btn.innerText = "Switch";
            }
        }
        else {
            document.getElementById("world-" + selectedSlot).querySelector("img").src = "data:image/png;base64, " + selectedTemplate.image;
            server.slots[selectedSlot].templateImage = selectedTemplate.image;
            server.minigameName = null;
            server.minigameId = null;
        }
        setPerformanceCookie(worldName(), JSON.stringify(server));
        window.scrollTo(0, 0);
        closeAll();
    }
    worldsPage.activateTemplate = activateTemplate;
    function moveSelectedTemplate(e) {
        if (templateWrapperDiv.classList.contains("hidden"))
            return;
        if (window.innerWidth < 795) {
            if (selectedTemplateDiv.style.top != "")
                selectedTemplateDiv.style.top = "";
            return;
        }
        let currentTop = Number(selectedTemplateDiv.style.top.split("px")[0]) || 0;
        let maximumOffset = selectedTemplateDiv.parentElement.getBoundingClientRect().height - getAbsoluteHeight(selectedTemplateDiv) - getAbsoluteHeight(selectedTemplateDiv.previousElementSibling) - 20;
        // console.log(selectedTemplateDiv);
        selectedTemplateDiv.style.top = Math.min(Math.max(0, currentTop - selectedTemplateDiv.getBoundingClientRect().y + 20), maximumOffset).toString() + "px";
    }
    function getAbsoluteHeight(el) {
        var styles = window.getComputedStyle(el);
        var margin = parseFloat(styles['marginTop']) +
            parseFloat(styles['marginBottom']);
        return Math.ceil(el.offsetHeight + margin);
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
    function getRecommendedPlayerNumbers(rp) {
        let result = [1, 11];
        if (!rp)
            return result;
        let input = rp.trim().split(" ")[0];
        if (input.includes("+")) {
            result[0] = Number(input.split("+")[0]);
        }
        else if (input.includes("-")) {
            let numbers = input.split("-");
            result = [Number(numbers[0]), Number(numbers[1])];
        }
        else {
            result = [Number(input), Number(input)];
        }
        return result;
    }
    function newWorld() {
        closeAll(false);
        document.getElementById("new-world").classList.remove("hidden");
    }
    worldsPage.newWorld = newWorld;
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
        let result = sendPOSTRequest(data);
        btn.disabled = false;
        if (result.error)
            return;
        closeAll();
    }
    worldsPage.makeNewWorld = makeNewWorld;
})(worldsPage || (worldsPage = {}));
