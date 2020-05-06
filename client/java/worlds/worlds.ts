namespace worldsPage {
  window.addEventListener("load", init);

  export let server: RealmsServer;
  let selectedSlot: number;
  let backupList: HTMLUListElement;
  export let switchButtons: HTMLCollectionOf<HTMLButtonElement>;
  async function init() {
    checkWorldId();
    checkCredentials();
    await getWorlds();
    switchButtons = <HTMLCollectionOf<HTMLButtonElement>>document.getElementsByClassName("switch-slot-btn");
    handleSwitchButtons(false);
    backupList = document.querySelector("ul#backup-list");
    for (let rep of document.querySelectorAll(".replacement")) {
      rep.addEventListener("click", replacementClick);
    }
  }

  async function getWorlds() {
    let tmp = getPerformanceCookie(worldName());
    if (tmp) {
      server = JSON.parse(tmp);
    } else {
      server = await detailRequest(null);
    }
    selectedSlot = server.activeSlot;
    let slots = server.slots;
    let worlds: HTMLDivElement = <HTMLDivElement>document.getElementById("worlds");
    worlds.innerHTML = "";
    for (let slot in slots) {
      let slotNumber = Number(slot);
      if (slotNumber == 4) continue;
      worlds.innerHTML += `
    <div class="world-wrapper ${slotNumber == server.activeSlot && !server.minigameId ? "active" : ""}" id="world-${slotNumber}">
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
    <div class="world-wrapper ${server.minigameId ? "active" : ""}" id="world-minigame">
      <img src="${server.minigameImage ? "data:image/png;base64, " + server.minigameImage : "../img/placeholder.png"}" alt="" class="world-image">
      <span class="world-name">${server.minigameName || "Minigame"}</span>
      <button id="show-minigames-btn" onclick="worldsPage.showMinigames()">${server.minigameId ? "Switch Minigame" : "Switch to temporary Minigame"}</button>
    </div>
    `;
  }

  export function showSettings(slot: number) {
    if (!server) return;
    closeAll(false);
    selectedSlot = slot;
    (<HTMLButtonElement>document.querySelector("#world-" + slot + " .world-settings-btn")).disabled = true;
    let slotOptions = server.slots[slot];
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
    sendPOSTRequest(data, () => {
      // update saved server and html display
      let slotOptions: RealmsWorldOptions = server.slots[selectedSlot];
      let settings = JSON.parse(data.newSettings);
      for (let setting in settings) {
        slotOptions[setting] = settings[setting];
      }
      (<HTMLSpanElement>document.getElementById("world-" + selectedSlot).querySelector(".world-name")).innerText = slotOptions.slotName != "" ? slotOptions.slotName : `World ${selectedSlot}`;
      showSettings(selectedSlot);
      setPerformanceCookie(worldName(), JSON.stringify(server));
    })
  }

  export function switchTo(slot: number) {
    if (!server) return;
    closeAll();
    handleSwitchButtons(true);
    let data = getCredentials();
    data["command"] = "changeSlot";
    data["world"] = worldid;
    data["slot"] = slot;
    sendPOSTRequest(data, null)
      .then((result) => {
        server = result;
        if (slot != 4)
          (<HTMLButtonElement>document.querySelector("#world-" + slot + " .switch-slot-btn")).disabled = true;
        (<HTMLSpanElement>document.getElementById("world-minigame").querySelector(".world-name")).innerText = "Minigame";
        (<HTMLImageElement>document.getElementById("world-minigame").querySelector("img")).src = "data:image/png;base64, " + server.minigameImage;
        document.getElementById("worlds").querySelector(".active").classList.remove("active");
        document.getElementById("world-" + slot).classList.add("active");
        document.getElementById("show-minigames-btn").innerText = "Switch to temporary Minigame";
        setPerformanceCookie(worldName(), JSON.stringify(server));
      })
      .finally(() => {
        handleSwitchButtons(false);
      })
  }

  export function showReplaceWorld(slot: number) {
    closeAll();
    (<HTMLButtonElement>document.querySelector(`#world-${slot} > .world-reset-btn`)).disabled = true;
    (<HTMLDivElement>document.getElementById("replace-header")).innerText = "Replacing World in \"" + (server.slots[slot].slotName || "World " + slot) + "\" with...";
    document.getElementById("world-reset").classList.remove("hidden");
    selectedSlot = slot;
  }

  function replacementClick(_e: Event) {
    let target: HTMLDivElement = <HTMLDivElement>_e.currentTarget;
    if (target.classList.contains("disabled")) return;
    for (let s in worldsPage) {
      if (s == target.id) {
        worldsPage[s]();
        return;
      }
    }
  }

  export function closeAll(clearSlot: boolean = true) {
    let buttons: HTMLButtonElement[] = Array.from(<HTMLCollectionOf<HTMLButtonElement>>document.getElementsByClassName("world-settings-btn"));
    buttons = buttons.concat(Array.from(<HTMLCollectionOf<HTMLButtonElement>>document.getElementsByClassName("world-reset-btn")));
    buttons.push(<HTMLButtonElement>document.getElementById("show-minigames-btn"));
    for (let btn of buttons) {
      if (btn)
        btn.disabled = false;
    }

    if (clearSlot) selectedSlot = null;
    let allDivs: HTMLCollectionOf<HTMLDivElement> = <HTMLCollectionOf<HTMLDivElement>>document.getElementsByClassName("settings-div");
    for (let div of allDivs) {
      div.classList.add("hidden");
    }
  }

  export function newWorld() {
    closeAll(false);
    document.getElementById("new-world").classList.remove("hidden");
  }

  export function handleSwitchButtons(disable: boolean) {
    if (disable) {
      for (let btn of switchButtons) {
        btn.disabled = true;
        btn.innerText = "Switching...";
      }
      return;
    }
    for (let btn of switchButtons) {
      btn.disabled = false;
      btn.innerText = "Switch";
      let slot: string = btn.getAttribute("slot");
      btn.setAttribute("onclick", `worldsPage.switchTo(${slot})`);
      if (slot == server.activeSlot.toString() && !server.minigameId) {
        btn.innerText = "Backups";
        btn.setAttribute("onclick", `worldsPage.showBackups(${slot})`);
      }
    }
  }

  export function makeNewWorld() {
    let btn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("make-new-world-btn");
    let seed: string = (<HTMLInputElement>document.getElementById("seed")).value;
    let levelType: string = (<HTMLInputElement>document.getElementById("leveltype")).value;
    let genStructures: boolean = (<HTMLInputElement>document.getElementById("genStructures")).checked;
    if (seed == "") { seed = Math.floor(Math.random() * Math.pow(2, 31) - 1).toString() }
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
      })
  }

  export function showBackups(_slot) {
    selectedSlot = _slot;
    document.getElementById("backup-download-a").innerText = "";
    document.getElementById("backup-wrapper").classList.remove("hidden");
    backupList.innerHTML = "<span>Loading...</span>"
    let data = getCredentials();
    data["command"] = "getBackups";
    data["world"] = worldid;
    sendPOSTRequest(data, (result) => {
      let backups: Backup[] = result.backups;
      backupList.innerHTML = "";
      for (let backup of backups) {
        backupList.innerHTML += `<li>
        <span id="backup-name">Backup</span>
        <span id="backup-date">${timeDisplay(backup.lastModifiedDate)}</span>
        <button onclick="worldsPage.restoreBackup('${backup.backupId}')" disabled>Restore</button>
      </li>`
      }
    });

    function timeDisplay(date: string): string {
      let modified: Date = new Date(date);
      let result: string = modified.toLocaleDateString() + " ";
      let seconds: number = (Date.now() - modified.valueOf()) / 1000;
      let minutes: number = seconds / 60;
      let hours: number = minutes / 60;
      let days: number = hours / 24;
      if (days > 0) {
        result += `(${Math.floor(days)} days ago)`;
      } else if (hours > 0) {
        result += `(${Math.floor(hours)} hours ago)`;
      } else if (minutes > 0) {
        result += `(${Math.floor(minutes)} minutes ago)`;
      } else if (seconds > 0) {
        result += `(${Math.floor(seconds)} seconds ago)`;
      } else {
        result += `(just now)`;
      }
      return result;
    }
  }
  export function downloadBackup() {
    let btn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("backup-download-btn");
    let a: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById("backup-download-a");
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
    }).finally(() => { btn.disabled = false; })
  }

  interface Backup {
    backupId: string,
    lastModifiedDate: string,
    size: number,
    metadata: {
      description: string,
      enabled_packs: string,
      game_difficulty: string,
      game_mode: string,
      game_server_version: string,
      name: string,
      world_type: string
    }
  }

}