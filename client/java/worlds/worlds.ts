namespace worldsPage {
  window.addEventListener("load", init);

  let worldid: number;
  let server: RealmsServer;
  let selectedSlot: number;
  let switchButtons: HTMLCollectionOf<HTMLButtonElement>;
  let templates: Template[];
  let selectedTemplateDiv: HTMLDivElement;
  let templateWrapperDiv: HTMLDivElement;
  function init() {
    worldid = checkWorldId();
    checkCredentials();
    getWorlds();
    switchButtons = <HTMLCollectionOf<HTMLButtonElement>>document.getElementsByClassName("switch-slot-btn");
    document.getElementById("template-search").addEventListener("input", filterTemplates);
    selectedTemplateDiv = <HTMLDivElement>document.getElementById("selected-template");
    templateWrapperDiv = <HTMLDivElement>document.getElementById("template-wrapper");
    window.addEventListener("scroll", moveSelectedTemplate);
  }

  function getWorlds() {
    let data = getCredentials();
    data["command"] = "detail";
    data["world"] = worldid;
    let result: RealmsServer = sendPOSTRequest(data);
    if (result.error) return;
    console.log(result);
    server = fixSlots(result);
    let slots = result.slots;
    let worlds: HTMLDivElement = <HTMLDivElement>document.getElementById("worlds");
    worlds.innerHTML = "";
    for (let i: number = 1; i < slots.size + 1; i++) {
      worlds.innerHTML += `
      <div class="world-wrapper ${i == result.activeSlot && !result.minigameId ? "active" : ""}" id="world-${i}">
        <img src="${slots.get(i).templateImage ? "data:image/png;base64, " + slots.get(i).templateImage : "../img/placeholder.png"}" alt="" class="world-image">
        <span class="world-name">${slots.get(i).slotName || `World ${i}`}</span>
        <button class="switch-slot-btn" onclick="worldsPage.switchTo(${i})" ${i == result.activeSlot && !result.minigameId ? "disabled" : ""}>Switch</button>
        <button class="world-settings-btn" onclick="worldsPage.showSettings(${i})" >World Settings</button>
        <button class="world-reset-btn" disabled>Replace World</button>
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

  export function showSettings(slot: number) {
    if (!server) return;
    closeAll();
    selectedSlot = slot;
    (<HTMLButtonElement>document.querySelector("#world-" + slot + " .world-settings-btn")).disabled = true;
    let slotOptions = server.slots.get(slot);
    document.getElementById("world-settings-wrapper").classList.remove("hidden");
    for (let setting in slotOptions) {
      let input: HTMLInputElement = <HTMLInputElement>document.getElementById(setting);
      if (!input) continue;
      if (input.type == "checkbox") {
        input.checked = slotOptions[setting];
      } else {
        input.value = slotOptions[setting];
      }
    }

    window.scrollTo(0, document.getElementById("world-settings-wrapper").offsetTop);
  }

  export function saveWorldSettings() {
    let form: HTMLFormElement = <HTMLFormElement>document.getElementById("world-settings");
    let data: any = getCredentials();
    data["command"] = "worldSettings";
    data["world"] = worldid;
    data["slot"] = selectedSlot;
    data["newSettings"] = {};
    let formdata: FormData = new FormData(form);
    for (let e of formdata.entries()) {
      if (e[1] == "false" || e[1] == "true") {
        data.newSettings[e[0]] = e[1] == "true";
      }
      else if (!isNaN(Number(e[1]))) {
        data.newSettings[e[0]] = Number(e[1]);
      } else {
        data.newSettings[e[0]] = e[1];
      }
    }
    data.newSettings = JSON.stringify(data.newSettings);
    let result = sendPOSTRequest(data);
    if (result.error) return;
    // update saved server and html display
    let slotOptions: RealmsWorldOptions = server.slots.get(selectedSlot);
    let settings = JSON.parse(data.newSettings);
    for (let setting in settings) {
      slotOptions[setting] = settings[setting];
    }
    (<HTMLSpanElement>document.getElementById("world-" + selectedSlot).querySelector(".world-name")).innerText = slotOptions.slotName != "" ? slotOptions.slotName : `World ${selectedSlot}`;
    showSettings(selectedSlot);
  }

  export function switchTo(slot: number) {
    if (!server) return;
    for (let btn of switchButtons) { btn.disabled = true; btn.innerText = "Switching..."; }
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
      (<HTMLButtonElement>document.querySelector("#world-" + server.activeSlot + " .switch-slot-btn")).disabled = true;
      return;
    }
    server = fixSlots(result);
    (<HTMLButtonElement>document.querySelector("#world-" + server.activeSlot + " .switch-slot-btn")).disabled = true;
    document.getElementById("worlds").querySelector(".active").classList.remove("active");
    document.getElementById("world-" + slot).classList.add("active");
    document.getElementById("show-minigames-btn").innerText = "Switch to temporary Minigame";
  }

  export function showMinigames() {
    closeAll();
    (<HTMLButtonElement>document.querySelector("#show-minigames-btn")).disabled=true;
    templateWrapperDiv.classList.remove("hidden");
    let data = getCredentials();
    data["command"] = "templates";
    data["type"] = "MINIGAMES";
    let result = sendPOSTRequest(data);
    if (result.error) return;
    displayTemplates(result);
  }

  function displayTemplates(_templates: Template[]) {
    if (!_templates || _templates.length <= 0) return;
    templates = _templates;
    document.getElementById("template-type").innerText = _templates[0].type;
    let templateDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("templates-wrapper");
    templateDiv.innerHTML = "";
    for (let temp of _templates) {
      let div: HTMLDivElement = document.createElement("div");
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

  export function filterTemplates(event: InputEvent) {
    let searchTerm: string = (<HTMLInputElement>event.target).value.toLowerCase();
    for (let temp of templates) {
      if (searchTerm == "" || temp.name.toLowerCase().includes(searchTerm) || temp.author.toLowerCase().includes(searchTerm)) {
        document.getElementById("template-" + temp.id).classList.remove("hidden");
      } else {
        document.getElementById("template-" + temp.id).classList.add("hidden");
      }
    }
  }

  export function selectTemplate(event: Event) {
    let id: number = Number((<HTMLDivElement>event.currentTarget).id.split("-")[1]);
    let selectedTemplate: Template = templates.find(tmp => tmp.id == id);
    let youtubeID: string = "";
    if (selectedTemplate.trailer.includes("youtube.com")) {
      youtubeID = selectedTemplate.trailer.split("v=")[1];
    } else if (selectedTemplate.trailer.includes("youtu.be")) {
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
    let previousActiveElement: HTMLElement = document.getElementById("templates-wrapper").querySelector(".active");
    if (previousActiveElement)
      previousActiveElement.classList.remove("active");
    (<HTMLElement>event.currentTarget).classList.add("active");
  }

  export function activateTemplate(id: number) {
    (<HTMLButtonElement>document.getElementById("template-confirm-button")).disabled = true;
    let data = getCredentials();
    data["command"] = "setMinigame";
    data["world"] = worldid;
    data["id"] = id;
    let result = sendPOSTRequest(data);
    (<HTMLButtonElement>document.getElementById("template-confirm-button")).disabled = false;
    if (result.error) return;
    document.getElementById("worlds").querySelector(".active").classList.remove("active");
    document.getElementById("world-minigame").classList.add("active");
    window.scrollTo(0, 0);
    templateWrapperDiv.classList.add("hidden");
    document.getElementById("show-minigames-btn").innerText = "Switch Minigame";
    let minigameContainer: HTMLElement = document.getElementById("world-minigame");
    let selectedTemplate: Template = templates.find(tmp => tmp.id == id);
    (<HTMLSpanElement>minigameContainer.querySelector(".world-name")).innerText = selectedTemplate.name;
    (<HTMLImageElement>minigameContainer.querySelector("img")).src = "data:image/png;base64, " + selectedTemplate.image;
  }

  function moveSelectedTemplate(e: Event) {
    if (templateWrapperDiv.classList.contains("hidden")) return;
    if (window.innerWidth < 795) {
      if (selectedTemplateDiv.style.top != "")
        selectedTemplateDiv.style.top = "";
      return;
    }
    let currentTop: number = Number(selectedTemplateDiv.style.top.split("px")[0]) || 0;
    let maximumOffset: number = selectedTemplateDiv.parentElement.getBoundingClientRect().height - getAbsoluteHeight(selectedTemplateDiv) - getAbsoluteHeight(<HTMLElement>selectedTemplateDiv.previousElementSibling) - 20;
    // console.log(selectedTemplateDiv);
    selectedTemplateDiv.style.top = Math.min(Math.max(0, currentTop - selectedTemplateDiv.getBoundingClientRect().y + 20), maximumOffset).toString() + "px";
  }

  function getAbsoluteHeight(el: HTMLElement) {
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginTop']) +
      parseFloat(styles['marginBottom']);

    return Math.ceil(el.offsetHeight + margin);
  }

  export function closeAll() {
    let buttons: HTMLButtonElement[] = Array.from(<HTMLCollectionOf<HTMLButtonElement>>document.getElementsByClassName("world-settings-btn"));
    // buttons = buttons.concat(Array.from(<HTMLCollectionOf<HTMLButtonElement>>document.getElementsByClassName("world-reset-btn")));
    buttons.push(<HTMLButtonElement>document.getElementById("show-minigames-btn"));
    for(let btn of buttons){
      btn.disabled = false;
    }
    
    selectedSlot = null;
    let allDivs: HTMLCollectionOf<HTMLDivElement> = <HTMLCollectionOf<HTMLDivElement>>document.getElementsByClassName("settings-div");
    for (let div of allDivs) {
      div.classList.add("hidden");
    }
  }

  interface Template {
    id: number;
    name: string;
    version: string;
    author: string;
    image: string;
    trailer: string;
    recommendedPlayers: string;
    type: string;
    link: string;
  }

}