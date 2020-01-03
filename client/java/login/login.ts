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

  export function loginNow() {
    let formData: FormData = new FormData(<HTMLFormElement>document.getElementById("login"));
    let emailElement: HTMLInputElement = <HTMLInputElement>document.getElementById("email");
    let passwordElement: HTMLInputElement = <HTMLInputElement>document.getElementById("password");
    if (!emailElement.checkValidity()) {
      emailElement.reportValidity();
      return;
    }
    let password: string = passwordElement.value;
    if (password.length <= 0) {
      passwordElement.reportValidity();
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
}

//TODO limit login attempts