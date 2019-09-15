namespace RealmPage {
  window.addEventListener("load", initLoginElements);
  let divLogin: HTMLDivElement;
  let divRealms: HTMLDivElement;
  let divLoginLoading: HTMLDivElement;
  let inputEmail: HTMLInputElement;
  let inputPassword: HTMLInputElement;
  let inputUsername: HTMLInputElement;
  let inputToken: HTMLInputElement;
  let buttonLoginPW: HTMLInputElement;
  let buttonLoginToken: HTMLInputElement;

  export let player: Player;
  
  function initLoginElements() {
    getLoginReferences();
    addInitEventListeners();
    //TODO: load login from cookie
  }
  
  function getLoginReferences() {
    divLogin = <HTMLDivElement>document.getElementById("login");
    divRealms = <HTMLDivElement>document.getElementById("realms");
    inputEmail = <HTMLInputElement>document.getElementById("login-email");
    inputPassword = <HTMLInputElement>document.getElementById("login-password");
    inputUsername = <HTMLInputElement>document.getElementById("login-username");
    inputToken = <HTMLInputElement>document.getElementById("login-authtoken");
    buttonLoginPW = <HTMLInputElement>document.getElementById("login-with-pw");
    buttonLoginToken = <HTMLInputElement>document.getElementById("login-with-token");
    divLoginLoading = <HTMLDivElement>document.getElementById("login-overlay");
  }

  function addInitEventListeners() {
    buttonLoginPW.addEventListener("click", loginWithPW);
    buttonLoginToken.addEventListener("click", loginWithToken);
  }

  async function loginWithPW(){
    let spanError: HTMLSpanElement = <HTMLSpanElement>divLogin.getElementsByClassName("errorMessage")[0];
    if(inputEmail.value.length <= 0) {
      spanError.innerText = "Please provide an email";
      return;
    }
    if(inputPassword.value.length <= 0) {
      spanError.innerText = "Please provide a password";
      return;
    }
    if(!inputEmail.checkValidity()){
      spanError.innerText = "Please provide a valid email";
      return;
    }
    spanError.innerText = "";
    divLoginLoading.style.display = "initial";

    let result: any = await attemptLoginWithPassword(inputEmail.value, inputPassword.value);
    divLoginLoading.style.display = "none";
    if(result.error){
      spanError.innerText = "Error: " + result.error;
      return;
    }
    player = result;
    hideLogin();
  }
  async function loginWithToken(){
    let spanError: HTMLSpanElement = <HTMLSpanElement>divLogin.getElementsByClassName("errorMessage")[1];
    if(inputUsername.value.length <= 0) {
      spanError.innerText = "Please provide a username";
      return;
    }
    if(inputToken.value.length <= 0) {
      spanError.innerText = "Please provide a token";
      return;
    }
    if(inputToken.value.length != 32){
      spanError.innerText = "The token should have a length of 32.";
      return;
    }
    if(!inputToken.checkValidity()){
      spanError.innerText = "The token can only contain a-f and 0-9";
      return;
    }
    spanError.innerText = "";
    divLoginLoading.style.display = "initial";

    let result: any = await attemptLoginWithToken(inputUsername.value, inputToken.value);
    divLoginLoading.style.display = "none";
    if(result.error){
      spanError.innerText = "Error: " + result.error;
      return;
    }
    player = result;
    hideLogin();
  }

  async function hideLogin(){
    divLoginLoading.style.display = "initial";
    //TODO: Add login as a cookie
    divLogin.style.display = "none";
    divRealms.style.display = "initial";
    divRealms.getElementsByTagName("h1")[0].innerText = player.name + "'s Realms";
    await initAllDisplays();
    divLoginLoading.style.display = "none";
  }
}