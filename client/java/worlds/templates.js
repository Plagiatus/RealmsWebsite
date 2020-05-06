var worldsPage;
(function (worldsPage) {
    window.addEventListener("load", initTemplates);
    window.addEventListener("scroll", moveSelectedTemplate);
    let selectedSlot;
    let templates = new Map();
    let currentTemplates;
    let selectedTemplateDiv;
    let templateWrapperDiv;
    let templateFilter;
    let templatePlayerFilter;
    function initTemplates() {
        selectedTemplateDiv = document.getElementById("selected-template");
        templateWrapperDiv = document.getElementById("template-wrapper");
        templateFilter = document.getElementById("template-search");
        templateFilter.addEventListener("input", filterTemplates);
        templatePlayerFilter = document.getElementById("player-amount");
        templatePlayerFilter.addEventListener("input", filterTemplates);
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
        worldsPage.closeAll(false);
        if (selectedSlot == 4)
            document.querySelector("#show-minigames-btn").disabled = true;
        templateWrapperDiv.classList.remove("hidden");
        document.getElementById("template-type").innerText = type;
        selectedTemplateDiv.innerHTML = "<span>Nothing selected</span>";
        document.getElementById("templates-wrapper").innerHTML = "<span>Loading...</span>";
        if (!templates.has(type)) {
            let data = getCredentials();
            data["command"] = "templates";
            data["type"] = type;
            sendPOSTRequest(data, (result) => {
                templates.set(type, result);
                displayTemplates(templates.get(type));
            });
        }
        else {
            displayTemplates(templates.get(type));
        }
    }
    function displayTemplates(_templates) {
        let templateDiv = document.getElementById("templates-wrapper");
        if (!_templates || _templates.length <= 0) {
            templateDiv.innerHTML = "<span>There are no templates in this category.</span>";
            currentTemplates = [];
            return;
        }
        currentTemplates = _templates;
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
        if (!currentTemplates || currentTemplates.length <= 0)
            return;
        let searchTerm = templateFilter.value.toLowerCase();
        let playerAmount = Number(templatePlayerFilter.value);
        let found = false;
        for (let temp of currentTemplates) {
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
        let selectedTemplate = currentTemplates.find(tmp => tmp.id == id);
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
        if (selectedSlot != 4 && selectedSlot != worldsPage.server.activeSlot) {
            worldsPage.switchTo(selectedSlot);
        }
        let data = getCredentials();
        data["command"] = selectedSlot == 4 ? "setMinigame" : "setTemplate";
        data["world"] = worldid;
        data["id"] = id;
        sendPOSTRequest(data, null)
            .then(() => {
            let selectedTemplate = currentTemplates.find(tmp => tmp.id == id);
            if (selectedSlot == 4) {
                document.getElementById("worlds").querySelector(".active").classList.remove("active");
                document.getElementById("world-minigame").classList.add("active");
                document.getElementById("show-minigames-btn").innerText = "Switch Minigame";
                let minigameContainer = document.getElementById("world-minigame");
                minigameContainer.querySelector(".world-name").innerText = selectedTemplate.name;
                minigameContainer.querySelector("img").src = "data:image/png;base64, " + selectedTemplate.image;
                worldsPage.server.minigameImage = selectedTemplate.image;
                worldsPage.server.minigameName = selectedTemplate.name;
                worldsPage.server.minigameId = id;
                worldsPage.handleSwitchButtons(false);
            }
            else {
                document.getElementById("world-" + selectedSlot).querySelector("img").src = "data:image/png;base64, " + selectedTemplate.image;
                worldsPage.server.slots[selectedSlot].templateImage = selectedTemplate.image;
                worldsPage.server.minigameName = null;
                worldsPage.server.minigameId = null;
            }
            setPerformanceCookie(worldName(), JSON.stringify(worldsPage.server));
            window.scrollTo(0, 0);
            worldsPage.closeAll();
        })
            .finally(() => {
            document.getElementById("template-confirm-button").disabled = false;
        });
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
})(worldsPage || (worldsPage = {}));
