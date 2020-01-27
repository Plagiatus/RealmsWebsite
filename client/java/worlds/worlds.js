var worldsPage;
(function (worldsPage) {
    window.addEventListener("load", init);
    let worldid;
    let server;
    let selectedSlot;
    let switchButtons;
    let templates;
    let selectedTemplateDiv;
    let templateWrapperDiv;
    function init() {
        // worldid = checkWorldId();
        // checkCredentials();
        // getWorlds();
        switchButtons = document.getElementsByClassName("switch-slot-btn");
        document.getElementById("template-search").addEventListener("input", filterTemplates);
        selectedTemplateDiv = document.getElementById("selected-template");
        templateWrapperDiv = document.getElementById("template-wrapper");
        window.addEventListener("scroll", moveSelectedTemplate);
        for (let rep of document.querySelectorAll(".replacement")) {
            rep.addEventListener("click", replacemenetClick);
        }
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
      <div class="world-wrapper ${i == result.activeSlot && !result.minigameId ? "active" : ""}" id="world-${i}">
        <img src="${slots.get(i).templateImage ? "data:image/png;base64, " + slots.get(i).templateImage : "../img/placeholder.png"}" alt="" class="world-image">
        <span class="world-name">${slots.get(i).slotName || `World ${i}`}</span>
        <button class="switch-slot-btn" onclick="worldsPage.switchTo(${i})" ${i == result.activeSlot && !result.minigameId ? "disabled" : ""}>Switch</button>
        <button class="world-settings-btn" onclick="worldsPage.showSettings(${i})">World Settings</button>
        <button class="world-reset-btn" onclick="worldsPage.showReplaceWorld(${i})">Replace World</button>
      </div>
      `;
        }
        worlds.innerHTML += `
    <div class="world-wrapper ${result.minigameId ? "active" : ""}" id="world-minigame">
      <img src="${result.minigameImage ? "data:image/png;base64, " + result.minigameImage : "../img/placeholder.png"}" alt="" class="world-image">
      <span class="world-name">${result.minigameName || "Minigame"}</span>
      <button id="show-minigames-btn" onclick="worldsPage.showMinigames()">${result.minigameId ? "Switch Minigame" : "Switch to temporary Minigame"}</button>
    </div>
    `;
    }
    function showSettings(slot) {
        if (!server)
            return;
        closeAll();
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
        let slotOptions = server.slots.get(selectedSlot);
        let settings = JSON.parse(data.newSettings);
        for (let setting in settings) {
            slotOptions[setting] = settings[setting];
        }
        document.getElementById("world-" + selectedSlot).querySelector(".world-name").innerText = slotOptions.slotName != "" ? slotOptions.slotName : `World ${selectedSlot}`;
        showSettings(selectedSlot);
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
        server = fixSlots(result);
        document.querySelector("#world-" + server.activeSlot + " .switch-slot-btn").disabled = true;
        document.getElementById("worlds").querySelector(".active").classList.remove("active");
        document.getElementById("world-" + slot).classList.add("active");
        document.getElementById("show-minigames-btn").innerText = "Switch to temporary Minigame";
    }
    worldsPage.switchTo = switchTo;
    function showReplaceWorld(slot) {
        closeAll();
        document.querySelector(`#world-${slot} > #world-reset-btn`).disabled = true;
        document.getElementById("replace-header").innerText = "Replacing World in " + (server.slots.get(slot).slotName || "World " + slot) + "with...";
        document.getElementById("world-reset").classList.remove("hidden");
    }
    worldsPage.showReplaceWorld = showReplaceWorld;
    function replacemenetClick(_e) {
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
        document.querySelector("#show-minigames-btn").disabled = true;
        getTemplates("MINIGAMES");
    }
    worldsPage.showMinigames = showMinigames;
    function showWorldTemplate() {
        getTemplates("WORLD_TEMPLATES");
    }
    worldsPage.showWorldTemplate = showWorldTemplate;
    function showInspiration() {
        getTemplates("INSPIRATIONS");
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
        closeAll();
        templateWrapperDiv.classList.remove("hidden");
        document.getElementById("template-type").innerText = type;
        let data = getCredentials();
        data["command"] = "templates";
        data["type"] = type;
        let result = sendPOSTRequest(data);
        if (result.error)
            return;
        displayTemplates(result);
    }
    function displayTemplates(_templates) {
        if (!_templates || _templates.length <= 0)
            return;
        templates = _templates;
        document.getElementById("template-type").innerText = _templates[0].type;
        let templateDiv = document.getElementById("templates-wrapper");
        templateDiv.innerHTML = "";
        for (let temp of _templates) {
            let div = document.createElement("div");
            div.classList.add("template");
            div.id = "template-" + temp.id;
            div.innerHTML = `
        <img src="data:image/png;base64, ${temp.image}" alt="">
        <span class="template-name">${temp.name}</span>
        <span class="template-author">By ${temp.author}</span>
        <span class="template-players">${temp.recommendedPlayers}</span>
      `;
            div.addEventListener("click", selectTemplate);
            templateDiv.appendChild(div);
        }
    }
    function filterTemplates(event) {
        let searchTerm = event.target.value.toLowerCase();
        for (let temp of templates) {
            if (searchTerm == "" || temp.name.toLowerCase().includes(searchTerm) || temp.author.toLowerCase().includes(searchTerm)) {
                document.getElementById("template-" + temp.id).classList.remove("hidden");
            }
            else {
                document.getElementById("template-" + temp.id).classList.add("hidden");
            }
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
      <span class="template-players">${selectedTemplate.recommendedPlayers}</span>`;
        if (selectedTemplate && selectedTemplate.trailer != "") {
            selectedTemplateDiv.innerHTML += `<iframe class="template-trailer" src="https://www.youtube.com/embed/${youtubeID}"></iframe>`;
        }
        if (selectedTemplate.link && selectedTemplate.link != "") {
            selectedTemplateDiv.innerHTML += `<a class="template-link" href="${selectedTemplate.link}">Creator Website</a>`;
        }
        selectedTemplateDiv.innerHTML += `<button class="template-confirm-button" id="template-confirm-button" onclick="worldsPage.activateTemplate(${id})">Select Minigame</button>`;
        // window.scrollTo(0, selectedTemplateDiv.offsetTop);
        let previousActiveElement = document.getElementById("templates-wrapper").querySelector(".active");
        if (previousActiveElement)
            previousActiveElement.classList.remove("active");
        event.currentTarget.classList.add("active");
    }
    worldsPage.selectTemplate = selectTemplate;
    function activateTemplate(id) {
        document.getElementById("template-confirm-button").disabled = true;
        let data = getCredentials();
        data["command"] = "setMinigame";
        data["world"] = worldid;
        data["id"] = id;
        let result = sendPOSTRequest(data);
        document.getElementById("template-confirm-button").disabled = false;
        if (result.error)
            return;
        document.getElementById("worlds").querySelector(".active").classList.remove("active");
        document.getElementById("world-minigame").classList.add("active");
        window.scrollTo(0, 0);
        templateWrapperDiv.classList.add("hidden");
        document.getElementById("show-minigames-btn").innerText = "Switch Minigame";
        let minigameContainer = document.getElementById("world-minigame");
        let selectedTemplate = templates.find(tmp => tmp.id == id);
        minigameContainer.querySelector(".world-name").innerText = selectedTemplate.name;
        minigameContainer.querySelector("img").src = "data:image/png;base64, " + selectedTemplate.image;
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
    function closeAll() {
        let buttons = Array.from(document.getElementsByClassName("world-settings-btn"));
        buttons = buttons.concat(Array.from(document.getElementsByClassName("world-reset-btn")));
        buttons.push(document.getElementById("show-minigames-btn"));
        for (let btn of buttons) {
            if (btn)
                btn.disabled = false;
        }
        selectedSlot = null;
        let allDivs = document.getElementsByClassName("settings-div");
        for (let div of allDivs) {
            div.classList.add("hidden");
        }
    }
    worldsPage.closeAll = closeAll;
})(worldsPage || (worldsPage = {}));
