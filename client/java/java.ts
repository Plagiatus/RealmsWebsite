//TODO: rewrite anything that takes a while (especially server requests) using webworkers for multithreadding.
// see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

// let serverAddress: string = "http://localhost:8100";
let serverAddress: string = "https://realmadmin.herokuapp.com";

//#region Error
let errorUnderlay: HTMLDivElement = null;

function displayError(error) {
  if (!errorUnderlay) setupError();
  let code: number = Number(error.toString().substring(0, 3));
  if (error.code) {
    switch (error.code) {
      case DOMException.NETWORK_ERR:
        showError(error.message, ERRINFO.NETWORK + " " + ERRINFO.EMAIL);
        break;
      default:
        showError(error.message);
    }
  } else if (!isNaN(code)) {
    let newErrorString: string = error.toString().substring(6);
    let newError = JSON.parse(newErrorString);
    switch (code) {
      default:
        showError(newError.error, newError.errorMessage);
    }
  } else if (error.error) {
    showError(error.error)
  } else {
    showError(error);
  }
}

function setupError() {
  errorUnderlay = document.createElement("div");

  errorUnderlay.style.width = "100%";
  errorUnderlay.style.height = "100%";
  errorUnderlay.style.backgroundColor = "rgba(0,0,0,0.2)";
  errorUnderlay.style.position = "absolute";
  errorUnderlay.style.top = "0";
  errorUnderlay.style.justifyContent = "center";
  errorUnderlay.style.display = "none";
  document.body.appendChild(errorUnderlay);

  errorUnderlay.innerHTML = `
  <div style="background-color:#eee; width:300px; padding:10px; align-self:center">
    <div style="text-align:center">⚠️ Error ⚠️</div>
    <span id="errorMessage" style="color:red;display:block">Error</span>
    <span id="errorInfo" style="font-style:italic;display:block">No further Information</span>
    <button style="margin:10px;" onclick="dismissError()">Close</button>
  </div>
  `;
}

function showError(_message: string, _further: string = "No further information.") {
  document.getElementById("errorMessage").innerText = _message;
  document.getElementById("errorInfo").innerHTML = _further;
  errorUnderlay.style.display = "flex";
}

function dismissError() {
  errorUnderlay.style.display = "none";
}

enum ERRINFO {
  EMAIL = "If this problem persists, <a href=\"mailto:bugs@plagiatus.net\">please let us know.</a>",
  NETWORK = "Either your internet or our server is broken. Please make sure your internet is working and retry again in a minute.",
  LOGOUT = "We couldn't validate you against the servers. Please <a href=\"../login\">login</a> again."
}
//#endregion

//#region Cookies
function getCookie(_key: string): string {
  let decCookie = decodeURIComponent(document.cookie);
  let cookies: string[] = decCookie.split(";");
  // console.log(cookies);
  for (let cookie of cookies) {
    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(_key + "=") == 0) {
      return cookie.substring(_key.length + 1);
    }
  }
}

function setCookie(_key: string, _value: string, _expires: number = 0, root: boolean = true) {
  if (_expires == 0) _expires = 24 * 365 * 10;
  let d: Date = new Date();
  d.setTime(Date.now() + _expires * 60 * 60 * 1000);
  let expires: string = "expires=" + d.toUTCString();
  document.cookie = _key + "=" + _value + ";" + expires + (root ? "; path=/" : "");
}

function removeCookie(_key: string, root:boolean = true) {
  setCookie(_key, "", -10, root); 
}

function isPerformanceCookieSet(): boolean {
  return getCookie("performance") == "true";
}

function setPerformanceCookie(_key: string, _value: string, root: boolean = true) {
  if (!isPerformanceCookieSet()) return;
  let i: number = 0;
  let maxCookieLength: number = 2000;
  while (_value.length > maxCookieLength) {
    let v: string = _value.substr(0, maxCookieLength);
    _value = _value.substring(maxCookieLength);
    setCookie(_key + "-" + i, v, 0.25, root);
    i++;
  }
  if(getCookie(_key + "-" + i)){
    removeCookie(_key + "-" + i)
  }
  setCookie(_key, _value, 0.25, root);
  console.log(_key, i);
}

function getPerformanceCookie(_key: string){
  try {
    JSON.parse(getCookie(_key));
    return getCookie(_key)
  } catch (error) {
    let value: string = "";
    let i: number = 0;
    while(getCookie(_key + "-" + i)){
      value += getCookie(_key + "-" + i);
      i++;
    }
    value += getCookie(_key);
    return value;
  }
}

function removePerformanceCookies() {
  removeCookie("realms")
  let decCookie = decodeURIComponent(document.cookie);
  let cookies: string[] = decCookie.split(";");
  for (let cookie of cookies) {
    let key = cookie.trim().split("=")[0];
    if (key.includes("world-")) {
      removeCookie(key);
    }
  }
}
//#endregion

//#region Credentials
function checkCredentials(andRedirect: boolean = true): boolean {
  let email: string = getCookie("email");
  let token: string = getCookie("token");
  let uuid: string = getCookie("uuid");
  let name: string = getCookie("name");
  let refresh: string = getCookie("refresh");
  if (!email || !token || !uuid || !name) {
    console.log("CREDENTIALS NOT THERE ANYMORE")
    if (andRedirect) window.location.replace("../login");
    return false;
  }
  if (!confirmCredentials(email, uuid, name, token)) {
    console.log("CREDENTIALS NOT WORKING ANYMORE!")
    if (andRedirect) window.location.replace("../login");
    return false;
  }
  if (refresh == "true") {
    refreshCredentials();
  }
  return true;
}

function setCredentials(_input, time: number) {
  let email: string = _input.email;
  let token: string = _input.token;
  let uuid: string = _input.uuid;
  let name: string = _input.name;
  if (!email || !token || !uuid || !name) {
    throw new Error("Not all parameters given");
  }
  // console.log(email, token, uuid, name);
  setCookie("email", email, time);
  setCookie("token", token, time);
  setCookie("uuid", uuid, time);
  setCookie("name", name, time);
}

function refreshCredentials() {
  let logintime: string = getCookie("logintime");
  let time: number = Number(logintime);
  if (isNaN(time)) {
    return false;
  }
  setCookie("email", getCookie("email"), time);
  setCookie("token", getCookie("token"), time);
  setCookie("uuid", getCookie("uuid"), time);
  setCookie("name", getCookie("name"), time);
}

function getCredentials() {
  return {
    email: getCookie("email"),
    token: getCookie("token"),
    uuid: getCookie("uuid"),
    name: getCookie("name")
  }
}

function confirmCredentials(email, uuid, name, token): boolean {
  //TODO might need to check the timeout on this, it might be too long. Or even remove it after all
  if (getCookie("credentialsConfirmed")) {
    return true;
  }
  let data = {
    command: "login",
    email: email,
    uuid: uuid,
    token: token,
    name: name
  }
  try {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("POST", serverAddress, false);
    xhr.send(JSON.stringify(data));
    if (xhr.response) {
      let result = JSON.parse(xhr.response);
      if (result.error) {
        return false;
      } else {
        // setCookie("credentialsConfirmed", "true", 0.5);
        return true;
      }
    }
    return false;
  } catch (error) {
    displayError(error);
  }
}

function removeCredentials() {
  removeCookie("email");
  removeCookie("token");
  removeCookie("uuid");
  removeCookie("name");
}

let worldid: number;
function checkWorldId() {
  let wid: number = Number(getCookie("worldid"));
  if (!getCookie("worldid")) {
    window.location.replace("../realms");
  }
  worldid = wid;
  return wid;
}
function worldName(): string {
  return "world-" + worldid;
}

//#endregion

function sendPOSTRequest(data: any): any {
  try {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("POST", serverAddress, false);
    xhr.send(JSON.stringify(data));
    if (xhr.response) {
      let result = JSON.parse(xhr.response);
      if (result.error) {
        displayError(result.error);
        return;
      }
      return result;
    }
  } catch (error) {
    displayError(error);
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function applyFormatingCodes(text: string): string {
  let result: string = "<span>";
  let classes = {
    "0": "black", "1": "dark_blue", "2": "dark_green", "3": "dark_aqua", "4": "dark_red", "5": "dark_purple", "6": "gold", "7": "gray", "8": "dark_gray", "9": "blue",
    "a": "green", "b": "aqua", "c": "red", "d": "light_purple", "e": "yellow", "f": "white", "k": "obfuscated", "l": "bold", "m": "strikethrough", "n": "underline", "o": "italic", "r": "reset"
  };
  let textArray: string[] = text.split("§");
  if (textArray.length <= 0) return "";
  let depth: number = 1;
  result += textArray[0];
  for (let i: number = 1; i < textArray.length; i++) {
    if (textArray[i].length <= 0) {
      result += "§";
      continue;
    }
    let char: string = textArray[i].substr(0, 1);
    if (char == "r") {
      resetDepth();
      continue;
    }
    if (!classes[char]) {
      result += "§" + textArray[i];
      continue;
    }
    result += `<span class="${classes[char]}">${textArray[i].substring(1)}`;
    depth++;
  }
  resetDepth();
  return result;
  function resetDepth() {
    for (let i: number = 0; i < depth; i++) {
      result += "</span>"
    }
    depth = 0;
  }
}

function obfuscate() {
  let toObsfuscate: Text[] = prepareObfuscation(document.getElementsByClassName("obfuscated"));
  setInterval(obfuscateThis, 100, toObsfuscate);
}

function obfuscateThis(texts: Text[]) {
  let chars: string = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZöäüÖÄÜ+-#@$%&/(\\()[]{}";
  for (let txt of texts) {
    let length: number = txt.data.length;
    let newText: string = "";
    for (let i: number = 0; i < length; i++) {
      newText += chars[Math.floor(Math.random() * chars.length)];
    }
    txt.data = newText;
  }
}

function prepareObfuscation(elements: HTMLCollectionOf<Element>): Text[] {
  let texts: Text[] = [];
  for (let elem of elements) {
    if (elem.children.length > 0) {
      texts = texts.concat(prepareObfuscation(elem.children));
    }
    for (let cN of elem.childNodes) {
      if (cN.nodeType == Node.TEXT_NODE) {
        texts.push(<Text>cN);
      }
    }
  }
  return texts;
}

// function fixSlots(server: any): RealmsServer {
//   server.slots = new Map(server.slots);
//   return server;
// }

// Usage:
// let wic: WorldIDChecker = new WorldIDChecker();
// wic.addEventListener("worldIDChange",yourFunction);
class WorldIDChecker extends EventTarget {
  private id: number;
  constructor() {
    super();
    this.id = Number(getCookie("worldid"));
    setInterval(this.checkID.bind(this), 1000)
  }
  checkID() {
    if (this.id == Number(getCookie("worldid"))) {
      return;
    }
    this.id = Number(getCookie("worldid"));
    this.dispatchEvent(new Event("worldIDChange"));
  }
}

interface RealmsServer {
  error: any;
  id: number;
  remoteSubscriptionId: number;
  owner: string;
  ownerUUID: string;
  properties: { name: string, description: string };
  defaultPermission: string;
  state: string;
  daysLeft: number;
  expired: boolean;
  expiredTrial: boolean;
  gracePeriod: boolean;
  worldType: string;
  players: Player[];
  maxPlayers: number;
  minigameName: string;
  minigameId: number;
  minigameImage: string;
  activeSlot: number;
  slots: Slot;
  member: boolean;
  clubId: number;
}
interface Slot {
  [item: number]: RealmsWorldOptions;
}
interface Player {
  name: string;
  uuid: string;
  operator: boolean;
  accepted: boolean;
  online: boolean;
}
interface RealmsWorldOptions {
  slotName: string;
  templateId: number;
  templateImage: string;
  adventureMap: boolean;
  empty: boolean;
  commandBlocks: boolean;
  difficulty: number;
  forceGameMode: boolean;
  gameMode: number;
  pvp: boolean;
  spawnAnimals: boolean;
  spawnMonsters: boolean;
  spawnNPCs: boolean;
  spawnProtection: boolean;
}