function getCookie(_key) {
    let decCookie = decodeURIComponent(document.cookie);
    let cookies = decCookie.split(";");
    for (let cookie of cookies) {
        while (cookie.charAt(0) == " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(_key + "=") == 0) {
            return cookie.substring(_key.length + 1);
        }
    }
}
function setCookie(_key, _value, _expires = 30) {
    let d = new Date();
    d.setTime(Date.now() + _expires * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = _key + "=" + _value + ";" + expires;
}
function removeCookie(_key) {
    setCookie(_key, "", -10);
}
//# sourceMappingURL=cookies.js.map