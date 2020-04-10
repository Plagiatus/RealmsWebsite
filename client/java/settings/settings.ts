namespace settings {

  window.addEventListener("load", init);

  let statusImg: HTMLImageElement;
  let openButton: HTMLButtonElement;
  let openText: HTMLSpanElement;
  let subscriptionText: HTMLSpanElement;
  let nameInput: HTMLInputElement;
  let descInput: HTMLInputElement;
  let preview: HTMLDivElement;
  let serverIsOpen: boolean;
  let daysLeft: number;

  function init() {
    checkWorldId();
    checkCredentials();
    statusImg = <HTMLImageElement>document.getElementById("openCloseImg");
    openButton = <HTMLButtonElement>document.getElementById("toggleOpen");
    openText = <HTMLSpanElement>document.getElementById("openCloseTxt");
    subscriptionText = <HTMLSpanElement>document.getElementById("subscription");
    nameInput = <HTMLInputElement>document.getElementById("name");
    descInput = <HTMLInputElement>document.getElementById("description");
    preview = <HTMLDivElement>document.getElementById("preview");
    getServer();
  }

  function getServer() {
    let tmp = getPerformanceCookie(worldName());
    if (tmp) {
      let realm = JSON.parse(tmp);
      initDisplay(realm);
      return;
    }
    detailRequest((result) => {
      initDisplay(result);
    })
  }

  function initDisplay(server: RealmsServer) {
    nameInput.value = server.properties.name;
    descInput.value = server.properties.description;
    serverIsOpen = server.state == "OPEN";
    daysLeft = server.daysLeft;
    subscriptionText.innerText = formatDays(daysLeft);
    updateOpenText();
    openButton.disabled = false;
    (<HTMLButtonElement>document.getElementById("updateNameDesc")).disabled = false;
    nameInput.addEventListener("input", updatePreview);
    descInput.addEventListener("input", updatePreview);
    updatePreview(null);
  }
  export function toggleOpen() {
    let btn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("toggleOpen");
    btn.disabled = true;
    if (serverIsOpen == undefined) return;
    let data = getCredentials();
    data["world"] = worldid;
    if (serverIsOpen)
      data["command"] = "close"
    else
      data["command"] = "open"
    sendPOSTRequest(data, null)
      .then(() => {
        serverIsOpen = !serverIsOpen;
      })
      .finally(() => {
        updateOpenText();
        btn.disabled = false;
      })
  }

  function updateOpenText() {
    //TODO: wrong image (yellow instead of off) when subscription ran out.
    openText.innerHTML = "Your Realm is currently " + (serverIsOpen ? "<span class='dark_green'>OPEN" : "<span class='red'>CLOSED") + "</span>";
    openButton.innerText = serverIsOpen ? "close" : "open";
    if (serverIsOpen) {
      statusImg.src = daysLeft > 15 ? "../img/on_icon.png" : "../img/expires_soon_icon.png";
    } else {
      statusImg.src = daysLeft > 0 ? "../img/off_icon.png" : "../img/expired_icon.png";
    }
  }

  export function updateNameDesc() {
    let btn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("updateNameDesc");
    btn.disabled = true;
    let data = getCredentials();
    data["command"] = "updateProperties";
    data["world"] = worldid;
    data["worldName"] = nameInput.value;
    data["worldDescription"] = descInput.value;
    sendPOSTRequest(data, null).then((res) => {
      console.log(res);
    })
      .finally(() => {
        btn.disabled = false;
      })
    //TODO: add feedback whether it worked or not.
  }

  function formatDays(daysLeft: number): string {
    if (daysLeft <= 0) {
      return "Susbscription ran out.";
    }
    let now: Date = new Date();
    let end: Date = new Date(Date.now() + 1000 * 60 * 60 * 24 * daysLeft);
    let year: number = end.getFullYear() - now.getFullYear();
    let months: number = end.getMonth() - now.getMonth();
    let days: number = end.getDate() - now.getDate();
    if (days < 0) {
      months--;
      days += 30;
    }
    if (months < 0) {
      year--;
      months += 12;
    }
    return `${year > 0 ? year + (year == 1 ? " year, " : " years, ") : ""}${months > 0 ? months + (months == 1 ? " month" : " months") + " and " : ""}${days} ${days == 1 ? "day" : "days"} remaining`;
  }

  export function updatePreview(_e: Event) {
    preview.innerHTML = `
    ${applyFormatingCodes(escapeHtml(nameInput.value))}<br>
    ${applyFormatingCodes(escapeHtml(descInput.value))}
    `
  }
  export function getIP() {
    let btn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("ip-btn");
    btn.disabled = true;
    let data = getCredentials();
    data["command"] = "getIP";
    data["world"] = localStorage.getItem("worldid");
    sendPOSTRequest(data, null)
      .then((result) => {
        let output = document.getElementById("ip-display");
        try {
          result = JSON.parse(result);
          output.innerText = result.address || result;
          output.classList.remove("hidden");
        }
        catch (error) {
          output.innerText = result;
        }
      })
      .finally(() => {
        btn.disabled = false;
      })
  }
}