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

function checkCredentials(andRedirect: boolean = true): boolean {
  let email: string = getCookie("email");
  let token: string = getCookie("token");
  let uuid: string = getCookie("uuid");
  let name: string = getCookie("name");
  let refresh: string = getCookie("refresh");
  if (!email || !token || !uuid || !name) {
    console.log("CREDENTIALS NOT THERE ANYMORE")
    if (andRedirect) window.location.replace("./login");
    return false;
  }
  if (!confirmCredentials(email, uuid, name, token)) {
    console.log("CREDENTIALS NOT WORKING ANYMORE!")
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
    xhr.open("POST", "http://localhost:8100", false);
    xhr.send(JSON.stringify(data));
    if (xhr.response) {
      let result = JSON.parse(xhr.response);
      if (result.error) {
        return false;
      } else {
        setCookie("credentialsConfirmed", "true", 0.5);
        return true;
      }
    }
  } catch (error) {
    displayError(error);
  }
}