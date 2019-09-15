var RealmPage;
(function (RealmPage) {
    window.addEventListener("load", initLoginElements);
    let divLogin;
    let divRealms;
    let divLoginLoading;
    let inputEmail;
    let inputPassword;
    let inputUsername;
    let inputToken;
    let buttonLoginPW;
    let buttonLoginToken;
    function initLoginElements() {
        getLoginReferences();
        addInitEventListeners();
        //TODO: load login from cookie
    }
    function getLoginReferences() {
        divLogin = document.getElementById("login");
        divRealms = document.getElementById("realms");
        inputEmail = document.getElementById("login-email");
        inputPassword = document.getElementById("login-password");
        inputUsername = document.getElementById("login-username");
        inputToken = document.getElementById("login-authtoken");
        buttonLoginPW = document.getElementById("login-with-pw");
        buttonLoginToken = document.getElementById("login-with-token");
        divLoginLoading = document.getElementById("login-overlay");
    }
    function addInitEventListeners() {
        buttonLoginPW.addEventListener("click", loginWithPW);
        buttonLoginToken.addEventListener("click", loginWithToken);
    }
    async function loginWithPW() {
        let spanError = divLogin.getElementsByClassName("errorMessage")[0];
        if (inputEmail.value.length <= 0) {
            spanError.innerText = "Please provide an email";
            return;
        }
        if (inputPassword.value.length <= 0) {
            spanError.innerText = "Please provide a password";
            return;
        }
        if (!inputEmail.checkValidity()) {
            spanError.innerText = "Please provide a valid email";
            return;
        }
        spanError.innerText = "";
        divLoginLoading.style.display = "initial";
        let result = await RealmPage.attemptLoginWithPassword(inputEmail.value, inputPassword.value);
        divLoginLoading.style.display = "none";
        if (result.error) {
            spanError.innerText = "Error: " + result.error;
            return;
        }
        RealmPage.player = result;
        hideLogin();
    }
    async function loginWithToken() {
        let spanError = divLogin.getElementsByClassName("errorMessage")[1];
        if (inputUsername.value.length <= 0) {
            spanError.innerText = "Please provide a username";
            return;
        }
        if (inputToken.value.length <= 0) {
            spanError.innerText = "Please provide a token";
            return;
        }
        if (inputToken.value.length != 32) {
            spanError.innerText = "The token should have a length of 32.";
            return;
        }
        if (!inputToken.checkValidity()) {
            spanError.innerText = "The token can only contain a-f and 0-9";
            return;
        }
        spanError.innerText = "";
        divLoginLoading.style.display = "initial";
        let result = await RealmPage.attemptLoginWithToken(inputUsername.value, inputToken.value);
        divLoginLoading.style.display = "none";
        if (result.error) {
            spanError.innerText = "Error: " + result.error;
            return;
        }
        RealmPage.player = result;
        hideLogin();
    }
    async function hideLogin() {
        divLoginLoading.style.display = "initial";
        //TODO: Add login as a cookie
        divLogin.style.display = "none";
        divRealms.style.display = "initial";
        divRealms.getElementsByTagName("h1")[0].innerText = RealmPage.player.name + "'s Realms";
        await RealmPage.initAllDisplays();
        divLoginLoading.style.display = "none";
    }
})(RealmPage || (RealmPage = {}));
//# sourceMappingURL=login.js.map