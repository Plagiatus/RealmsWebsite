logout();
function logout() {
    let data = {
        command: "invalidate",
        token: getCookie("token")
    };
    let result = sendPOSTRequest(data);
    if (result.error)
        return;
    removeCredentials();
    removePerformanceCookies();
    window.location.replace("../login");
}
