var cookies;
(function (cookies) {
    headerFooter.loadLoginHeader = true;
    window.addEventListener("load", init);
    function init() {
        if (!localStorage.getItem("performance"))
            localStorage.setItem("performance", "true");
        for (let input of document.getElementsByTagName("input")) {
            input.addEventListener("change", changeSetting);
            if (input.id == "performanceCookies") {
                input.checked = isPerformanceCookieSet();
            }
        }
    }
    function changeSetting(_e) {
        let checkbox = _e.target;
        switch (checkbox.id) {
            case "necessaryCookies":
                checkbox.disabled = true;
                checkbox.checked = true;
                console.log("tststs. Stop messing with the html code!");
                break;
            case "performanceCookies":
                localStorage.setItem("performance", checkbox.checked.toString());
                break;
            default:
                console.log("How did you get here? You probably did something with the html right? Here, let me undo all your work.");
                setTimeout(() => { location.reload(); }, 4000);
                break;
        }
    }
})(cookies || (cookies = {}));
