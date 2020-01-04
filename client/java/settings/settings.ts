namespace settings {

  window.addEventListener("load", init);

  let statusImg: HTMLImageElement;
  let openButton: HTMLButtonElement;
  let openText: HTMLSpanElement;
  let subscriptionText: HTMLSpanElement;
  let nameInput: HTMLInputElement;
  let descInput: HTMLInputElement;
  let serverIsOpen: boolean;
  let daysLeft: number;

  function init() {
    checkCredentials();
    checkWorldId();
    statusImg = <HTMLImageElement>document.getElementById("openCloseImg");
    openButton = <HTMLButtonElement>document.getElementById("toggleOpen");
    openText = <HTMLSpanElement>document.getElementById("openCloseTxt");
    subscriptionText = <HTMLSpanElement>document.getElementById("subscription");
    nameInput = <HTMLInputElement>document.getElementById("name");
    descInput = <HTMLInputElement>document.getElementById("description");
    getServer();
  }

  function getServer() {
    let data = getCredentials();
    data["command"] = "detail";
    data["world"] = getCookie("worldid");
    let request = sendPOSTRequest(data);
    initDisplay(request);
  }

  function initDisplay(server) {
    nameInput.value = server.properties.name;
    descInput.value = server.properties.description;
    serverIsOpen = server.state == "OPEN";
    daysLeft = server.daysLeft;
    subscriptionText.innerText = formatDays(daysLeft);
    updateOpenText();
  }
  export function toggleOpen() {
    if (serverIsOpen == undefined) return;
    let data = getCredentials();
    data["world"] = getCookie("worldid");
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
    openText.innerText = "Your Realm is currently " + (serverIsOpen ? "OPEN" : "CLOSE");
    openButton.innerText = serverIsOpen ? "close" : "open";
    if(serverIsOpen){
      statusImg.src = daysLeft > 15 ? "../img/on_icon.png" : "../img/expires_soon_icon.png";
    } else {
      statusImg.src = daysLeft > 0 ? "../img/off_icon.png" : "../img/expired_icon.png";
    }
  }

  export function updateNameDesc() {
    let data = getCredentials();
    data["command"] = "updateProperties";
    data["world"] = getCookie("worldid");
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
}