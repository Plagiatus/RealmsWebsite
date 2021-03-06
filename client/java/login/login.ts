namespace login {
  if (isLocalStorageSupported()) {
    window.addEventListener("load", init);
    headerFooter.loadLoginHeader = true;
    if (!localStorage.getItem("performance")) window.location.replace("../cookies");
  } else {
    alert("We're sorry, but your browser does not support the technologies we're using to make this website work.\nPlease update your browser or switch to a different one.");
  }

  async function init() {
    if (await checkCredentials(false)) {
      console.log("already logged in")
      window.location.replace("../realms");
      return;
    }
    removeCredentials();
    removePerformanceCookies();
  }

  export async function loginWithEmail() {
    loginError("");
    let formData: FormData = new FormData(<HTMLFormElement>document.getElementById("login"));
    let emailElement: HTMLInputElement = <HTMLInputElement>document.getElementById("email");
    if (!emailElement.checkValidity()) {
      emailElement.reportValidity();
      loginError("Please provide a valid email");
      return;
    }
    let password: string = String(formData.get("password"));
    if (password.length <= 0) {
      loginError("Please provide a password");
      return;
    }
    let email: string = emailElement.value;
    // console.log(email, password, remember, refresh);
    let player = await authenticate(email, password);
    if (player) {
      setCredentials(player);
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
    sendPOSTRequest(data, (result) => {
      let player = { name: playername, uuid: uuid, token: token, email: email };
      // let remember: number = Number(formData.get("remember"));
      // let refresh: boolean = Boolean(formData.get("refresh"));
      setCredentials(player);
      // localStorage.setItem("refresh", refresh.toString());
      window.location.replace("..");
    });
  }

  async function authenticate(_email: string, _password: string) {
    let data = {
      command: "authenticate",
      email: _email,
      password: _password
    }
    let result = await sendPOSTRequest(data, null);
    return result;
    // try {
    //   let xhr: XMLHttpRequest = new XMLHttpRequest();
    //   xhr.open("POST", serverAddress, false);
    //   xhr.send(JSON.stringify(data));
    //   if (xhr.response) {
    //     let result = JSON.parse(xhr.response);
    //     if (result.error) {
    //       displayError(result.error);
    //     } else {
    //       console.log(result);
    //     }
    //   }
    // } catch (error) {
    //   displayError(error);
    // }
    // return null;
  }

  function loginError(msg: string) {
    document.getElementById("errormessage").innerText = msg;
  }
}

//check whether localStorage is supported
function isLocalStorageSupported() {
  try {
    const key = "__some_random_key_we_are_not_going_to_use__";
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}


//TODO limit login attempts