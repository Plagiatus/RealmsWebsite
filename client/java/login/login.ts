namespace login {
  window.addEventListener("load", init);

  function init() {
    // console.log(window.location);
    if (checkCredentials(false)) {
      console.log("already logged in")
      window.location.replace("..");
      return;
    }
  }

  export function loginWithEmail() {
    loginError("");
    let formData: FormData = new FormData(<HTMLFormElement>document.getElementById("login"));
    let emailElement: HTMLInputElement = <HTMLInputElement>document.getElementById("email");
    if (!emailElement.checkValidity()) {
      emailElement.reportValidity();
      return;
    }
    let password: string = String(formData.get("password"));
    if (password.length <= 0) {
      loginError("Please provide a password");
      return;
    }
    let email: string = emailElement.value;
    let remember: number = Number(formData.get("remember"));
    let refresh: boolean = Boolean(formData.get("refresh"));
    // console.log(email, password, remember, refresh);
    let player = authenticate(email, password);
    if (player) {
      setCredentials(player, remember);
      setCookie("refresh", refresh.toString(), remember);
      window.location.replace("..");
    }
  }

  export function loginWithToken() {
    loginError("");
    let formData: FormData = new FormData(<HTMLFormElement>document.getElementById("login"));
    let emailElement: HTMLInputElement = <HTMLInputElement>document.getElementById("email2");
    // let tokenElement: HTMLInputElement = <HTMLInputElement>document.getElementById("token");
    let email: string = emailElement.value;
    if (!emailElement.checkValidity() || email.length <= 0) {
      emailElement.reportValidity();
      loginError("Please provide a valid email");
      return;
    }
    let playername: string = String(formData.get("playername"));
    if (playername.length <= 0) {
      loginError("Please provide your playername");
      return;
    }
    let uuid: string = String(formData.get("uuid"));
    uuid = uuid.replace(/-/g, "");
    console.log(uuid, uuid.length);
    if (uuid.length != 32) {
      loginError("please provide a valid uuid");
      return;
    }
    let token: string = String(formData.get("token"));
    if (token.length <= 0) {
      loginError("Please provide a token");
      return;
    }
    let data = {
      command: "login",
      token: token,
      uuid: uuid,
      email: email
    }
    let result = sendPOSTRequest(data);
    if (result.error) return;
    let player = { name: playername, uuid: uuid, token: token, email: email };
    let remember: number = Number(formData.get("remember"));
    let refresh: boolean = Boolean(formData.get("refresh"));
    setCredentials(player, remember);
    setCookie("refresh", refresh.toString(), remember);
    window.location.replace("..");
  }

  function authenticate(_email: string, _password: string) {
    let data = {
      command: "authenticate",
      email: _email,
      password: _password
    }
    try {
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open("POST", serverAddress, false);
      xhr.send(JSON.stringify(data));
      if (xhr.response) {
        let result = JSON.parse(xhr.response);
        if (result.error) {
          displayError(result.error);
        } else {
          console.log(result);
          return result;
        }
      }
    } catch (error) {
      displayError(error);
    }
    return null;
  }

  function loginError(msg: string) {
    document.getElementById("errormessage").innerText = msg;
  }
}

//TODO limit login attempts