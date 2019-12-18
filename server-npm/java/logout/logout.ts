logout();
function logout() {
  let data = {
    command: "invalidate",
    token: getCookie("token")
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
        removeCredentials();
        window.location.replace("..")
      }
    }
  } catch (error) {
    displayError(error);
  }
}