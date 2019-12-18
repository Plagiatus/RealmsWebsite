var login;
(function (login) {
    window.addEventListener("load", init);
    function init() {
        // console.log(window.location);
        if (checkCredentials(false)) {
            console.log("already logged in");
            window.location.replace("..");
            return;
        }
    }
    function loginNow() {
        let formData = new FormData(document.getElementById("login"));
        let emailElement = document.getElementById("email");
        let passwordElement = document.getElementById("password");
        if (!emailElement.checkValidity()) {
            emailElement.reportValidity();
            return;
        }
        let password = passwordElement.value;
        if (password.length <= 0) {
            passwordElement.reportValidity();
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
    login.loginNow = loginNow;
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
})(login || (login = {}));
//TODO limit login attempts
