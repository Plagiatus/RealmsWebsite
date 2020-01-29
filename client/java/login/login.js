var login;
(function (login) {
    window.addEventListener("load", init);
    headerFooter.loadHeader = false;
    function init() {
        if (checkCredentials(false)) {
            console.log("already logged in");
            window.location.replace("../realms");
            return;
        }
    }
    function loginWithEmail() {
        loginError("");
        let formData = new FormData(document.getElementById("login"));
        let emailElement = document.getElementById("email");
        if (!emailElement.checkValidity()) {
            emailElement.reportValidity();
            loginError("Please provide a valid email");
            return;
        }
        let password = String(formData.get("password"));
        if (password.length <= 0) {
            loginError("Please provide a password");
            return;
        }
        let email = emailElement.value;
        let remember = Number(formData.get("remember"));
        let refresh = Boolean(formData.get("refresh"));
        // console.log(email, password, remember, refresh);
        let player = authenticate(email, password);
        if (player) {
            setCredentials(player, remember);
            setCookie("refresh", refresh.toString(), remember);
            window.location.replace("..");
        }
    }
    login.loginWithEmail = loginWithEmail;
    function loginWithToken() {
        loginError("");
        let formData = new FormData(document.getElementById("login"));
        let emailElement = document.getElementById("email2");
        // let tokenElement: HTMLInputElement = <HTMLInputElement>document.getElementById("token");
        let email = emailElement.value;
        if (!emailElement.checkValidity() || email.length <= 0) {
            emailElement.reportValidity();
            loginError("Please provide a valid email");
            return;
        }
        let playername = String(formData.get("playername"));
        if (playername.length <= 0) {
            loginError("Please provide your playername");
            return;
        }
        let uuid = String(formData.get("uuid"));
        uuid = uuid.replace(/-/g, "");
        console.log(uuid, uuid.length);
        if (uuid.length != 32) {
            loginError("please provide a valid uuid");
            return;
        }
        let token = String(formData.get("token"));
        if (token.length <= 0) {
            loginError("Please provide a token");
            return;
        }
        let data = {
            command: "login",
            token: token,
            uuid: uuid,
            email: email
        };
        let result = sendPOSTRequest(data);
        if (result.error)
            return;
        let player = { name: playername, uuid: uuid, token: token, email: email };
        let remember = Number(formData.get("remember"));
        let refresh = Boolean(formData.get("refresh"));
        setCredentials(player, remember);
        setCookie("refresh", refresh.toString(), remember);
        window.location.replace("..");
    }
    login.loginWithToken = loginWithToken;
    function authenticate(_email, _password) {
        let data = {
            command: "authenticate",
            email: _email,
            password: _password
        };
        try {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", serverAddress, false);
            xhr.send(JSON.stringify(data));
            if (xhr.response) {
                let result = JSON.parse(xhr.response);
                if (result.error) {
                    displayError(result.error);
                }
                else {
                    console.log(result);
                    return result;
                }
            }
        }
        catch (error) {
            displayError(error);
        }
        return null;
    }
    function loginError(msg) {
        document.getElementById("errormessage").innerText = msg;
    }
})(login || (login = {}));
//TODO limit login attempts
