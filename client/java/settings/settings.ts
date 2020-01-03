namespace settings {

  window.addEventListener("load", init);

  let statusImg: HTMLImageElement;
  let openButton: HTMLButtonElement;
  let openText: HTMLSpanElement;
  let nameInput: HTMLInputElement;
  let descInput: HTMLInputElement;
  let serverIsOpen: boolean;

  function init() {
    // checkCredentials();
    // checkWorldId();
    statusImg = <HTMLImageElement>document.getElementById("openCloseImg");
    openButton = <HTMLButtonElement>document.getElementById("toggleOpen");
    openText = <HTMLSpanElement>document.getElementById("openCloseTxt");
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
    //TODO: status image
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
}