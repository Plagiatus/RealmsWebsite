var settings;
(function (settings) {
    window.addEventListener("load", init);
    let statusImg;
    let openButton;
    let openText;
    let nameInput;
    let descInput;
    let serverIsOpen;
    function init() {
        // checkCredentials();
        // checkWorldId();
        statusImg = document.getElementById("openCloseImg");
        openButton = document.getElementById("toggleOpen");
        openText = document.getElementById("openCloseTxt");
        nameInput = document.getElementById("name");
        descInput = document.getElementById("description");
        getServer();
    }
    function getServer() {
        let data = getCredentials();
        data["command"] = "detail";
        data["world"] = getCookie("worldid");
        let request = sendPOSTRequest(data);
        initDisplay(request);
    }
    function initDisplay(server) {
        nameInput.value = server.properties.name;
        descInput.value = server.properties.description;
        serverIsOpen = server.state == "OPEN";
        updateOpenText();
    }
    function toggleOpen() {
        if (serverIsOpen == undefined)
            return;
        let data = getCredentials();
        data["world"] = getCookie("worldid");
        if (serverIsOpen)
            data["command"] = "close";
        else
            data["command"] = "open";
        let request = sendPOSTRequest(data);
        if (request.error)
            return;
        serverIsOpen = !serverIsOpen;
        updateOpenText();
    }
    settings.toggleOpen = toggleOpen;
    function updateOpenText() {
        openText.innerText = "Your Realm is currently " + (serverIsOpen ? "OPEN" : "CLOSE");
        openButton.innerText = serverIsOpen ? "close" : "open";
        //TODO: status image
    }
    function updateNameDesc() {
        let data = getCredentials();
        data["command"] = "updateProperties";
        data["world"] = getCookie("worldid");
        data["worldName"] = nameInput.value;
        data["worldDescription"] = descInput.value;
        let request = sendPOSTRequest(data);
        console.log(request);
    }
    settings.updateNameDesc = updateNameDesc;
})(settings || (settings = {}));
