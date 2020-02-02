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
    if (getCookie(worldName())) {
      let realm = JSON.parse(getPerformanceCookie(worldName()));
      initDisplay(realm);
      return;
    }
    let data = getCredentials();
    data["command"] = "detail";
    data["world"] = worldid;
    let request = sendPOSTRequest(data);
    setPerformanceCookie(worldName(), JSON.stringify(request));
    initDisplay(request);
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
    if (serverIsOpen == undefined) return;
    let data = getCredentials();
    data["world"] = worldid;
    if (serverIsOpen)
      data["command"] = "close"
    else
      data["command"] = "open"
    let request = sendPOSTRequest(data);
    if (request.error) return;
    serverIsOpen = !serverIsOpen;
    updateOpenText();
  }

  function updateOpenText() {
    openText.innerHTML = "Your Realm is currently " + (serverIsOpen ? "<span class='dark_green'>OPEN" : "<span class='red'>CLOSED") + "</span>";
    openButton.innerText = serverIsOpen ? "close" : "open";
    if (serverIsOpen) {
      statusImg.src = daysLeft > 15 ? "../img/on_icon.png" : "../img/expires_soon_icon.png";
    } else {
      statusImg.src = daysLeft > 0 ? "../img/off_icon.png" : "../img/expired_icon.png";
    }
  }

  export function updateNameDesc() {
    let data = getCredentials();
    data["command"] = "updateProperties";
    data["world"] = worldid;
    data["worldName"] = nameInput.value;
    data["worldDescription"] = descInput.value;
    let request = sendPOSTRequest(data);
    console.log(request);
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
    let btn: HTMLButtonElement = <HTMLButtonElement> document.getElementById("ip-btn");
    btn.disabled = true;
    let data = getCredentials();
    data["command"] = "getIP";
    data["world"] = getCookie("worldid");
    let result = sendPOSTRequest(data);
    btn.disabled = false;
    try {
      result = JSON.parse(result);
    } catch (error) {
      
    }
    if(result.error) return;
    let output = document.getElementById("ip-display");
    output.innerText = result.address || result;
    output.classList.remove("hidden");
  }
}