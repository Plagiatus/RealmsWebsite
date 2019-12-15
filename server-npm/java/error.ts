let errorUnderlay: HTMLDivElement = null;

function displayError(error) {
  if (!errorUnderlay) setupError();
  let code: number = Number(error.toString().substring(0, 3));
  if (error.code) {
    switch (error.code) {
      case DOMException.NETWORK_ERR:
        showError(error.message, ERRINFO.NETWORK + " " + ERRINFO.EMAIL);
        break;
      default:
        showError(error.message);
    }
  } else if (!isNaN(code)) {
    let newErrorString: string = error.toString().substring(6);
    let newError = JSON.parse(newErrorString);
    switch (code) {
      default:
        showError(newError.error, newError.errorMessage);
    }
  } else if (error.error) {
    showError(error.error)
  } else {
    showError(error);
  }
}

function setupError() {
  errorUnderlay = document.createElement("div");

  errorUnderlay.style.width = "100%";
  errorUnderlay.style.height = "100%";
  errorUnderlay.style.backgroundColor = "rgba(0,0,0,0.2)";
  errorUnderlay.style.position = "absolute";
  errorUnderlay.style.top = "0";
  errorUnderlay.style.justifyContent = "center";
  errorUnderlay.style.display = "none";
  document.body.appendChild(errorUnderlay);

  errorUnderlay.innerHTML = `
  <div style="background-color:#eee; width:300px; padding:10px; align-self:center">
    <div style="text-align:center">⚠️ Error ⚠️</div>
    <span id="errorMessage" style="color:red;display:block">Error</span>
    <span id="errorInfo" style="font-style:italic;display:block">No further Information</span>
    <button style="margin:10px;" onclick="dismissError()">Close</button>
  </div>
  `;
}

function showError(_message: string, _further: string = "No further information.") {
  document.getElementById("errorMessage").innerText = _message;
  document.getElementById("errorInfo").innerHTML = _further;
  errorUnderlay.style.display = "flex";
}

function dismissError() {
  errorUnderlay.style.display = "none";
}

enum ERRINFO {
  EMAIL = "If this problem persists, <a href=\"mailto:bugs@plagiatus.net\">please let us know.</a>",
  NETWORK = "Either your internet or our server is broken. Please make sure your internet is working and retry again in a minute."

}