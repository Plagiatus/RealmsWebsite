function getCookie(_key: string): string {
  let decCookie = decodeURIComponent(document.cookie);
  let cookies: string[] = decCookie.split(";");
  for (let cookie of cookies){
    while(cookie.charAt(0) ==" "){
      cookie = cookie.substring(1);
    }
    if(cookie.indexOf(_key+"=") == 0){
      return cookie.substring(_key.length+1);
    }
  }
}

function setCookie(_key: string, _value: string, _expires: number = 30) {
  let d: Date = new Date();
  d.setTime(Date.now() + _expires * 24 * 60 * 60 * 1000);
  let expires: string = "expires=" + d.toUTCString();
  document.cookie = _key + "=" + _value + ";" + expires;
}

function removeCookie(_key: string){
  setCookie(_key, "", -10);
}