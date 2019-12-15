function getCookie(_key) {
    let decCookie = decodeURIComponent(document.cookie);
    let cookies = decCookie.split(";");
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
function setCookie(_key, _value, _expires = 0) {
    if (_expires == 0)
        _expires = 24 * 365 * 10;
    let d = new Date();
    d.setTime(Date.now() + _expires * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = _key + "=" + _value + ";" + expires + "; path=/";
}
function removeCookie(_key) {
    setCookie(_key, "", -10);
}
function checkCredentials(andRedirect = true) {
    let email = getCookie("email");
    let token = getCookie("token");
    let uuid = getCookie("uuid");
    let name = getCookie("name");
    let refresh = getCookie("refresh");
    if (!email || !token || !uuid || !name) {
        console.log("CREDENTIALS NOT THERE ANYMORE");
        if (andRedirect)
            window.location.replace("./login");
        return false;
    }
    if (!confirmCredentials(email, uuid, name, token)) {
        console.log("CREDENTIALS NOT WORKING ANYMORE!");
        return false;
    }
    if (refresh == "true") {
        refreshCredentials();
    }
    return true;
}
function setCredentials(_input, time) {
    let email = _input.email;
    let token = _input.token;
    let uuid = _input.uuid;
    let name = _input.name;
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
    let logintime = getCookie("logintime");
    let time = Number(logintime);
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
    };
}
function confirmCredentials(email, uuid, name, token) {
    if (getCookie("credentialsConfirmed")) {
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
        xhr.open("POST", "http://localhost:8100", false);
        xhr.send(JSON.stringify(data));
        if (xhr.response) {
            let result = JSON.parse(xhr.response);
            if (result.error) {
                return false;
            }
            else {
                setCookie("credentialsConfirmed", "true", 0.5);
                return true;
            }
        }
    }
    catch (error) {
        displayError(error);
    }
}
