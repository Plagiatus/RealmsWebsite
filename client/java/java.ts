//TODO: rewrite anything that takes a while (especially server requests) using webworkers for multithreadding.
// see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

let serverAddress: string = "http://localhost:8100";
// let serverAddress: string = "https://realmadmin.herokuapp.com";

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
  NETWORK = "Either your internet or our server is broken. Please make sure your internet is working and retry again in a minute."

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

function setCookie(_key: string, _value: string, _expires: number = 0) {
  if (_expires == 0) _expires = 24 * 365 * 10;
  let d: Date = new Date();
  d.setTime(Date.now() + _expires * 60 * 60 * 1000);
  let expires: string = "expires=" + d.toUTCString();
  document.cookie = _key + "=" + _value + ";" + expires + "; path=/";
}

function removeCookie(_key: string) {
  setCookie(_key, "", -10);
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
  if(getCookie("credentialsConfirmed")){
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

function removeCredentials(){
  removeCookie("email");
  removeCookie("token");
  removeCookie("uuid");
  removeCookie("name");
}

function checkWorldId(){
  if(!getCookie("worldid")){
    window.location.replace("..");
  }
}

//#endregion

function sendPOSTRequest(data: any): any{
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