var settings;
(function (settings) {
    window.addEventListener("load", init);
    let statusImg;
    let openButton;
    let openText;
    let subscriptionText;
    let nameInput;
    let descInput;
    let preview;
    let serverIsOpen;
    let daysLeft;
    function init() {
        checkWorldId();
        checkCredentials();
        statusImg = document.getElementById("openCloseImg");
        openButton = document.getElementById("toggleOpen");
        openText = document.getElementById("openCloseTxt");
        subscriptionText = document.getElementById("subscription");
        nameInput = document.getElementById("name");
        descInput = document.getElementById("description");
        preview = document.getElementById("preview");
        getServer();
    }
    function getServer() {
        let tmp = getPerformanceCookie(worldName());
        if (tmp) {
            let realm = JSON.parse(tmp);
            initDisplay(realm);
            return;
        }
        let data = getCredentials();
        data["command"] = "detail";
        data["world"] = worldid;
        let request = sendPOSTRequest(data);
        setPerformanceCookie(worldName(), JSON.stringify(request));
        initDisplay(request);
    }
    function initDisplay(server) {
        nameInput.value = server.properties.name;
        descInput.value = server.properties.description;
        serverIsOpen = server.state == "OPEN";
        daysLeft = server.daysLeft;
        subscriptionText.innerText = formatDays(daysLeft);
        updateOpenText();
        openButton.disabled = false;
        document.getElementById("updateNameDesc").disabled = false;
        nameInput.addEventListener("input", updatePreview);
        descInput.addEventListener("input", updatePreview);
        updatePreview(null);
    }
    function toggleOpen() {
        if (serverIsOpen == undefined)
            return;
        let data = getCredentials();
        data["world"] = worldid;
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
        //TODO: wrong image (yellow instead of off) when subscription ran out.
        openText.innerHTML = "Your Realm is currently " + (serverIsOpen ? "<span class='dark_green'>OPEN" : "<span class='red'>CLOSED") + "</span>";
        openButton.innerText = serverIsOpen ? "close" : "open";
        if (serverIsOpen) {
            statusImg.src = daysLeft > 15 ? "../img/on_icon.png" : "../img/expires_soon_icon.png";
        }
        else {
            statusImg.src = daysLeft > 0 ? "../img/off_icon.png" : "../img/expired_icon.png";
        }
    }
    function updateNameDesc() {
        let data = getCredentials();
        data["command"] = "updateProperties";
        data["world"] = worldid;
        data["worldName"] = nameInput.value;
        data["worldDescription"] = descInput.value;
        let request = sendPOSTRequest(data);
        console.log(request);
    }
    settings.updateNameDesc = updateNameDesc;
    function formatDays(daysLeft) {
        if (daysLeft <= 0) {
            return "Susbscription ran out.";
        }
        let now = new Date();
        let end = new Date(Date.now() + 1000 * 60 * 60 * 24 * daysLeft);
        let year = end.getFullYear() - now.getFullYear();
        let months = end.getMonth() - now.getMonth();
        let days = end.getDate() - now.getDate();
        if (days < 0) {
            months--;
            days += 30;
        }
        if (months < 0) {
            year--;
            months += 12;
        }
        return `${year > 0 ? year + (year == 1 ? " year, " : " years, ") : ""}${months > 0 ? months + (months == 1 ? " month" : " months") + " and " : ""}${days} ${days == 1 ? "day" : "days"} remaining`;
    }
    function updatePreview(_e) {
        preview.innerHTML = `
    ${applyFormatingCodes(escapeHtml(nameInput.value))}<br>
    ${applyFormatingCodes(escapeHtml(descInput.value))}
    `;
    }
    settings.updatePreview = updatePreview;
    function getIP() {
        let btn = document.getElementById("ip-btn");
        btn.disabled = true;
        let data = getCredentials();
        data["command"] = "getIP";
        data["world"] = localStorage.getItem("worldid");
        let result = sendPOSTRequest(data);
        btn.disabled = false;
        try {
            result = JSON.parse(result);
        }
        catch (error) {
        }
        if (result.error)
            return;
        let output = document.getElementById("ip-display");
        output.innerText = result.address || result;
        output.classList.remove("hidden");
    }
    settings.getIP = getIP;
})(settings || (settings = {}));
