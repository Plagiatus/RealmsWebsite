var RealmPage;
(function (RealmPage) {
    RealmPage.realms = [];
    async function initAllDisplays() {
        RealmPage.realms = await RealmPage.getOwnedRealms(RealmPage.player);
        console.log(RealmPage.realms);
        //@ts-ignore
        // realms.push({name: "Testrealm 2", motd:"nothing to see here"});
        initTabs();
        RealmPage.updatePlayerDisplay(RealmPage.realms[0].players);
    }
    RealmPage.initAllDisplays = initAllDisplays;
    function initTabs() {
        let tabs = document.getElementById("RealmsList");
        tabs.innerHTML = "";
        let tab0 = document.getElementsByClassName("tab0")[0];
        let panels = document.getElementById("ControlPanels");
        for (let i = 0; i < RealmPage.realms.length && i < 10; i++) {
            let label = document.createElement("label");
            label.setAttribute("for", "tab" + i);
            label.innerText = RealmPage.realms[i].name;
            tabs.appendChild(label);
            if (i > 0) {
                let tab = tab0.cloneNode(true);
                tab.classList.remove("tab0");
                tab.classList.add("tab" + i);
                panels.appendChild(tab);
            }
        }
    }
    function updateAllDisplays() {
    }
    RealmPage.updateAllDisplays = updateAllDisplays;
})(RealmPage || (RealmPage = {}));
//# sourceMappingURL=realms.js.map