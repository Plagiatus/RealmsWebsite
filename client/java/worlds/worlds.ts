namespace worldsPage {
  window.addEventListener("load", init);

  let worldid: number;
  let server: RealmsServer;
  let selectedSlot: number;
  function init() {
    worldid = checkWorldId();
    checkCredentials();
    getWorlds();
  }

  function getWorlds() {
    let data = getCredentials();
    data["command"] = "detail";
    data["world"] = worldid;
    let result: RealmsServer = sendPOSTRequest(data);
    if (result.error) return;
    console.log(result);
    result.slots = new Map(result.slots);
    server = result;
    let slots = result.slots;
    let worlds: HTMLDivElement = <HTMLDivElement>document.getElementById("worlds");
    worlds.innerHTML = "";
    for (let i: number = 1; i < slots.size + 1; i++) {
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

  export function showSettings(slot: number) {
    if (!server) return;
    selectedSlot = slot;
    let slotOptions = server.slots.get(slot);
    document.getElementById("world-settings-wrapper").classList.remove("hidden");
    for(let setting in slotOptions){
      let input: HTMLInputElement = <HTMLInputElement> document.getElementById(setting);
      if(!input) continue;
      if(input.type == "checkbox"){
        input.checked = slotOptions[setting];
      } else {
        input.value = slotOptions[setting];
      }
    }
  }
  
  export function saveWorldSettings(){
    let form: HTMLFormElement = <HTMLFormElement>document.getElementById("world-settings");
    let data: any = getCredentials();
    data["command"] = "worldSettings";
    data["worldid"] = worldid;
    data["slot"] = selectedSlot;
    data["newSettings"] = {};
    let formdata: FormData = new FormData(form);
    for(let e of formdata.entries()){
      if(e[1] == "false" || e[1] == "true"){
        data.newSettings[e[0]] = e[1] == "true";
      }
      else if(!isNaN(Number(e[1]))){
        data.newSettings[e[0]] = Number(e[1]);
      } else {
        data.newSettings[e[0]] = e[1];
      }
    }
    console.log(data);
  }

  export function cancelWorldSettings(){
    document.getElementById("world-settings-wrapper").classList.add("hidden");
  }
}