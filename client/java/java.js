//TODO: rewrite anything that takes a while (especially server requests) using webworkers for multithreadding.
// see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
// let serverAddress: string = "http://localhost:8100";
let serverAddress = "https://realmadmin.herokuapp.com";
//#region Error
let errorUnderlay = null;
function displayError(error) {
    if (!errorUnderlay)
        setupError();
    let code = Number(error.toString().substring(0, 3));
    if (error.code) {
        switch (error.code) {
            case DOMException.NETWORK_ERR:
                showError(error.message, ERRINFO.NETWORK + " " + ERRINFO.EMAIL);
                break;
            default:
                showError(error.message);
        }
    }
    else if (!isNaN(code)) {
        let newErrorString = error.toString().substring(6);
        let newError = JSON.parse(newErrorString);
        switch (code) {
            default:
                showError(newError.error, newError.errorMessage);
        }
    }
    else if (error.error) {
        showError(error.error);
    }
    else {
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
function showError(_message, _further = "No further information.") {
    console.error(_message);
    document.getElementById("errorMessage").innerText = _message;
    document.getElementById("errorInfo").innerHTML = _further;
    errorUnderlay.style.display = "flex";
}
function dismissError() {
    errorUnderlay.style.display = "none";
}
var ERRINFO;
(function (ERRINFO) {
    ERRINFO["EMAIL"] = "If this problem persists, <a href=\"mailto:bugs@plagiatus.net\">please let us know.</a>";
    ERRINFO["NETWORK"] = "Either your internet or our server is broken. Please make sure your internet is working and retry again in a minute.";
    ERRINFO["LOGOUT"] = "We couldn't validate you against the servers. Please <a href=\"../login\">login</a> again.";
})(ERRINFO || (ERRINFO = {}));
//#endregion
//#region Cookies
// function getCookie(_key: string): string {
//   let decCookie = decodeURIComponent(document.cookie);
//   let cookies: string[] = decCookie.split(";");
//   // console.log(cookies);
//   for (let cookie of cookies) {
//     while (cookie.charAt(0) == " ") {
//       cookie = cookie.substring(1);
//     }
//     if (cookie.indexOf(_key + "=") == 0) {
//       return cookie.substring(_key.length + 1);
//     }
//   }
// }
// function setCookie(_key: string, _value: string, _expires: number = 0, root: boolean = true) {
//   if (_expires == 0) _expires = 24 * 365 * 10;
//   let d: Date = new Date();
//   d.setTime(Date.now() + _expires * 60 * 60 * 1000);
//   let expires: string = "expires=" + d.toUTCString();
//   document.cookie = _key + "=" + _value + ";" + expires + (root ? "; path=/" : "");
// }
// function removeCookie(_key: string, root:boolean = true) {
//   setCookie(_key, "", -10, root); 
// }
function isPerformanceCookieSet() {
    return localStorage.getItem("performance") == "true";
}
// function isPerformanceCookieSet(): boolean {
//   return getCookie("performance") == "true";
// }
function setPerformanceCookie(_key, _value) {
    if (!isPerformanceCookieSet())
        return;
    let performanceCookieExpiration = 10;
    localStorage.setItem(_key, _value);
    localStorage.setItem(_key + "-exp", (Date.now() + 1000 * 60 * performanceCookieExpiration).toString());
}
function getPerformanceCookie(_key, _cb) {
    if (localStorage.getItem(_key) && Number(localStorage.getItem(_key + "-exp")) > Date.now()) {
        return localStorage.getItem(_key);
    }
    else {
        if (_cb) {
            _cb();
        }
        return null;
    }
}
function removePerformanceCookies() {
    localStorage.removeItem("realms");
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.includes("world-")) {
            localStorage.removeItem(key);
        }
    }
}
// function removePerformanceCookies() {
//   removeCookie("realms");
//   let decCookie = decodeURIComponent(document.cookie);
//   let cookies: string[] = decCookie.split(";");
//   for (let cookie of cookies) {
//     let key = cookie.trim().split("=")[0];
//     if (key.includes("world-")) {
//       removeCookie(key);
//     }
//   }
// }
//#endregion
//#region Credentials
function checkCredentials(andRedirect = true) {
    let email = localStorage.getItem("email");
    let token = localStorage.getItem("token");
    let uuid = localStorage.getItem("uuid");
    let name = localStorage.getItem("name");
    if (!email || !token || !uuid || !name) {
        console.log("CREDENTIALS NOT THERE ANYMORE");
        if (andRedirect)
            window.location.replace("../login");
        return false;
    }
    if (!confirmCredentials(email, uuid, name, token)) {
        console.log("CREDENTIALS NOT WORKING ANYMORE!");
        if (andRedirect)
            window.location.replace("../login");
        return false;
    }
    return true;
}
function setCredentials(_input) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    let name = _input.name;
    if (!email || !token || !uuid || !name) {
        throw new Error("Not all parameters given");
    }
    // console.log(email, token, uuid, name);
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
    localStorage.setItem("uuid", uuid);
    localStorage.setItem("name", name);
}
// function refreshCredentials() {
//   let logintime: string = localStorage.getItem("logintime");
//   let time: number = Number(logintime);
//   if (isNaN(time)) {
//     return false;
//   }
//   localStorage.setItem("email", localStorage.getItem("email"), time);
//   localStorage.setItem("token", localStorage.getItem("token"), time);
//   localStorage.setItem("uuid", localStorage.getItem("uuid"), time);
//   localStorage.setItem("name", localStorage.getItem("name"), time);
// }
function getCredentials() {
    return {
        email: localStorage.getItem("email"),
        token: localStorage.getItem("token"),
        uuid: localStorage.getItem("uuid"),
        name: localStorage.getItem("name")
    };
}
function confirmCredentials(email, uuid, name, token) {
    //TODO might need to check the timeout on this, it might be too long. Or even remove it after all
    if (localStorage.getItem("credentialsConfirmed")) {
        return true;
    }
    let data = {
        command: "login",
        email: email,
        uuid: uuid,
        token: token,
        name: name
    };
    try {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", serverAddress, false);
        xhr.send(JSON.stringify(data));
        if (xhr.response) {
            let result = JSON.parse(xhr.response);
            if (result.error) {
                return false;
            }
            else {
                // localStorage.setItem("credentialsConfirmed", "true", 0.5);
                return true;
            }
        }
        return false;
    }
    catch (error) {
        displayError(error);
    }
}
function removeCredentials() {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("uuid");
    localStorage.removeItem("name");
}
let worldid;
function checkWorldId() {
    let wid = Number(localStorage.getItem("worldid"));
    if (!localStorage.getItem("worldid")) {
        window.location.replace("../realms");
    }
    worldid = wid;
    return wid;
}
function worldName() {
    return "world-" + worldid;
}
//#endregion
function sendPOSTRequest(data) {
    try {
        let xhr = new XMLHttpRequest();
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
    }
    catch (error) {
        displayError(error);
    }
}
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function applyFormatingCodes(text) {
    let result = "<span>";
    let classes = {
        "0": "black", "1": "dark_blue", "2": "dark_green", "3": "dark_aqua", "4": "dark_red", "5": "dark_purple", "6": "gold", "7": "gray", "8": "dark_gray", "9": "blue",
        "a": "green", "b": "aqua", "c": "red", "d": "light_purple", "e": "yellow", "f": "white", "k": "obfuscated", "l": "bold", "m": "strikethrough", "n": "underline", "o": "italic", "r": "reset"
    };
    let textArray = text.split("§");
    if (textArray.length <= 0)
        return "";
    let depth = 1;
    result += textArray[0];
    for (let i = 1; i < textArray.length; i++) {
        if (textArray[i].length <= 0) {
            result += "§";
            continue;
        }
        let char = textArray[i].substr(0, 1);
        if (char == "r") {
            resetDepth();
            result += textArray[i].substring(1);
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
        for (let i = 0; i < depth; i++) {
            result += "</span>";
        }
        depth = 0;
    }
}
function obfuscate() {
    let toObsfuscate = prepareObfuscation(document.getElementsByClassName("obfuscated"));
    setInterval(obfuscateThis, 100, toObsfuscate);
}
function obfuscateThis(texts) {
    let chars = "abcdeghjmnopqrsuvwxyz1234567890ABCDEFGHJKLMNOPQRSTUVWXYZöäüÖÄÜ+-#$%&/\\";
    for (let txt of texts) {
        let length = txt.data.length;
        let newText = "";
        for (let i = 0; i < length; i++) {
            newText += txt.data[i] == " " ? " " : chars[Math.floor(Math.random() * chars.length)];
        }
        txt.data = newText;
    }
}
function prepareObfuscation(elements) {
    let texts = [];
    for (let elem of elements) {
        if (elem.children.length > 0) {
            texts = texts.concat(prepareObfuscation(elem.children));
        }
        for (let cN of elem.childNodes) {
            if (cN.nodeType == Node.TEXT_NODE) {
                texts.push(cN);
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
    constructor() {
        super();
        this.id = Number(localStorage.getItem("worldid"));
        setInterval(this.checkID.bind(this), 1000);
    }
    checkID() {
        if (this.id == Number(localStorage.getItem("worldid"))) {
            return;
        }
        this.id = Number(localStorage.getItem("worldid"));
        this.dispatchEvent(new Event("worldIDChange"));
    }
}
//TODO: remove this temporary blocking of performance cookies!
// localStorage.setItem("performance","false");
