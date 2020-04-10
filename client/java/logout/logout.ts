logout();
async function logout() {
  let data = {
    command: "invalidate",
    token: localStorage.getItem("token")
  }
  sendPOSTRequest(data, null);

  removeCredentials();
  removePerformanceCookies();
  window.location.replace("../login");
}