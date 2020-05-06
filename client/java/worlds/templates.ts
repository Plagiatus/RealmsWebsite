namespace worldsPage {
  window.addEventListener("load", initTemplates);
  window.addEventListener("scroll", moveSelectedTemplate);
  let selectedSlot: number;
  let templates: Map<string, Template[]> = new Map<string, Template[]>();
  let currentTemplates: Template[];
  let selectedTemplateDiv: HTMLDivElement;
  let templateWrapperDiv: HTMLDivElement;
  let templateFilter: HTMLInputElement;
  let templatePlayerFilter: HTMLInputElement;

  function initTemplates(){
    selectedTemplateDiv = <HTMLDivElement>document.getElementById("selected-template");
    templateWrapperDiv = <HTMLDivElement>document.getElementById("template-wrapper");
    templateFilter = <HTMLInputElement>document.getElementById("template-search");
    templateFilter.addEventListener("input", filterTemplates);
    templatePlayerFilter = <HTMLInputElement>document.getElementById("player-amount");
    templatePlayerFilter.addEventListener("input", filterTemplates);
  }

  export function showMinigames() {
    selectedSlot = 4;
    getTemplates("MINIGAMES");
  }
  export function showWorldTemplate() {
    getTemplates("WORLD_TEMPLATES");
  }
  export function showInspiration() {
    getTemplates("INSPIRATION");
  }
  export function showExperience() {
    getTemplates("EXPERIENCES");
  }
  export function showAdventure() {
    getTemplates("ADVENTURES");
  }

  function getTemplates(type: string) {
    closeAll(false);
    if (selectedSlot == 4)
      (<HTMLButtonElement>document.querySelector("#show-minigames-btn")).disabled = true;
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
    } else {
      displayTemplates(templates.get(type));
    }
  }

  function displayTemplates(_templates: Template[]) {
    let templateDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("templates-wrapper");
    if (!_templates || _templates.length <= 0) {
      templateDiv.innerHTML = "<span>There are no templates in this category.</span>";
      currentTemplates = [];
      return;
    }
    currentTemplates = _templates;
    document.getElementById("template-type").innerText = _templates[0].type;
    templateDiv.innerHTML = "";
    for (let temp of _templates) {
      let div: HTMLDivElement = document.createElement("div");
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
      let players: [number, number] = getRecommendedPlayerNumbers(temp.recommendedPlayers);
      temp.playerMin = players[0];
      temp.playerMax = players[1];
    }
    let span: HTMLSpanElement = document.createElement("span");
    span.innerText = "No templates match your search.";
    span.classList.add("hidden");
    span.id = "nothing-found";
    templateDiv.appendChild(span);
  }

  export function filterTemplates(event: Event) {
    if (!currentTemplates || currentTemplates.length <= 0) return;
    let searchTerm: string = templateFilter.value.toLowerCase();
    let playerAmount: number = Number(templatePlayerFilter.value);
    let found: boolean = false;
    for (let temp of currentTemplates) {
      if ((searchTerm == "" || temp.name.toLowerCase().includes(searchTerm) || temp.author.toLowerCase().includes(searchTerm))
        && (playerAmount == 0 || (playerAmount >= temp.playerMin && playerAmount <= temp.playerMax))) {
        document.getElementById("template-" + temp.id).classList.remove("hidden");
        found = true;
      } else {
        document.getElementById("template-" + temp.id).classList.add("hidden");
      }
    }
    if (found) {
      document.getElementById("nothing-found").classList.add("hidden");
    } else {
      document.getElementById("nothing-found").classList.remove("hidden");
    }
  }

  export function selectTemplate(event: Event) {
    let id: number = Number((<HTMLDivElement>event.currentTarget).id.split("-")[1]);
    let selectedTemplate: Template = currentTemplates.find(tmp => tmp.id == id);
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
      ${selectedTemplate.recommendedPlayers ? `<span class="template-players">${selectedTemplate.recommendedPlayers}</span>` : ""}`;
    if (selectedTemplate && selectedTemplate.trailer != "") {
      selectedTemplateDiv.innerHTML += `<iframe class="template-trailer" src="https://www.youtube.com/embed/${youtubeID}"></iframe>`;
    }
    if (selectedTemplate.link && selectedTemplate.link != "") {
      selectedTemplateDiv.innerHTML += `<a class="template-link" href="${selectedTemplate.link}">Creator Website</a>`;
    }
    selectedTemplateDiv.innerHTML += `<button class="template-confirm-button" id="template-confirm-button" onclick="worldsPage.activateTemplate(${id})">Select</button>`;
    // window.scrollTo(0, selectedTemplateDiv.offsetTop);
    let previousActiveElement: HTMLElement = document.getElementById("templates-wrapper").querySelector(".active");
    if (previousActiveElement)
      previousActiveElement.classList.remove("active");
    (<HTMLElement>event.currentTarget).classList.add("active");
  }

  export function activateTemplate(id: number) {
    (<HTMLButtonElement>document.getElementById("template-confirm-button")).disabled = true;
    if (selectedSlot != 4 && selectedSlot != worldsPage.server.activeSlot) {
      switchTo(selectedSlot);
    }
    let data = getCredentials();
    data["command"] = selectedSlot == 4 ? "setMinigame" : "setTemplate";
    data["world"] = worldid;
    data["id"] = id;
    sendPOSTRequest(data, null)
      .then(() => {
        let selectedTemplate: Template = currentTemplates.find(tmp => tmp.id == id);
        if (selectedSlot == 4) {
          document.getElementById("worlds").querySelector(".active").classList.remove("active");
          document.getElementById("world-minigame").classList.add("active");
          document.getElementById("show-minigames-btn").innerText = "Switch Minigame";
          let minigameContainer: HTMLElement = document.getElementById("world-minigame");
          (<HTMLSpanElement>minigameContainer.querySelector(".world-name")).innerText = selectedTemplate.name;
          (<HTMLImageElement>minigameContainer.querySelector("img")).src = "data:image/png;base64, " + selectedTemplate.image;
          server.minigameImage = selectedTemplate.image;
          server.minigameName = selectedTemplate.name;
          server.minigameId = id;
          handleSwitchButtons(false);
        } else {
          document.getElementById("world-" + selectedSlot).querySelector("img").src = "data:image/png;base64, " + selectedTemplate.image;
          server.slots[selectedSlot].templateImage = selectedTemplate.image;
          server.minigameName = null;
          server.minigameId = null;
        }
        setPerformanceCookie(worldName(), JSON.stringify(server));
        window.scrollTo(0, 0);
        closeAll();
      })
      .finally(() => {
        (<HTMLButtonElement>document.getElementById("template-confirm-button")).disabled = false;
      })
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
    selectedTemplateDiv.style.top = Math.min(Math.max(0, currentTop - (<DOMRect>selectedTemplateDiv.getBoundingClientRect()).y + 20), maximumOffset).toString() + "px";
  }

  function getAbsoluteHeight(el: HTMLElement) {
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginTop']) +
      parseFloat(styles['marginBottom']);

    return Math.ceil(el.offsetHeight + margin);
  }

  
  function getRecommendedPlayerNumbers(rp: string): [number, number] {
    let result: [number, number] = [1, 11];
    if (!rp) return result;
    let input = rp.trim().split(" ")[0];
    if (input.includes("+")) {
      result[0] = Number(input.split("+")[0]);
    } else if (input.includes("-")) {
      let numbers: string[] = input.split("-");
      result = [Number(numbers[0]), Number(numbers[1])];
    } else {
      result = [Number(input), Number(input)]
    }
    return result;
  }

  interface Template {
    id: number;
    name: string;
    version: string;
    author: string;
    image: string;
    trailer: string;
    recommendedPlayers: string;
    playerMin: number;
    playerMax: number;
    type: string;
    link: string;
  }

}