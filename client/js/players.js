var RealmPage;
(function (RealmPage) {
    window.addEventListener("load", initPlayersElements);
    let ulPlayerList;
    let inputNewPlayer;
    let buttonNewPlayer;
    function initPlayersElements() {
        ulPlayerList = document.getElementsByClassName("PlayerList")[0];
        inputNewPlayer = document.getElementById("RealmInvite");
        buttonNewPlayer = document.getElementById("RealmAddPlayer");
        buttonNewPlayer.addEventListener("click", addNewPlayer);
        ulPlayerList.addEventListener("click", modifyPlayer);
    }
    async function addNewPlayer() {
        await RealmPage.invitePlayer(RealmPage.player, RealmPage.realms[0], inputNewPlayer.value);
        let uuid = await RealmPage.getUUID(inputNewPlayer.value);
        let invitedPlayer = { name: inputNewPlayer.value, uuid: uuid, accepted: false, online: false, operator: false, permission: "MEMBER" };
        addPlayer(invitedPlayer);
    }
    async function modifyPlayer(_e) {
        if (_e.target instanceof HTMLInputElement) {
            let target = _e.target;
            let uuid = target.parentElement.getAttribute("uuid");
            switch (target.name) {
                case "OP":
                    if (target.classList.contains("op")) {
                        RealmPage.deopPlayer(RealmPage.player, RealmPage.realms[0], uuid);
                        target.classList.remove("op");
                    }
                    else {
                        RealmPage.opPlayer(RealmPage.player, RealmPage.realms[0], uuid);
                        target.classList.add("op");
                    }
                    break;
                case "removePlayer":
                    await RealmPage.removePlayer(RealmPage.player, RealmPage.realms[0], uuid);
                    target.parentElement.parentElement.removeChild(target.parentElement);
                    break;
            }
        }
    }
    function updatePlayerDisplay(_players) {
        ulPlayerList.innerHTML = "";
        _players = _players.sort(sortPlayers);
        for (let p of _players) {
            addPlayer(p);
        }
    }
    RealmPage.updatePlayerDisplay = updatePlayerDisplay;
    function sortPlayers(_a, _b) {
        if (_a.accepted && _b.accepted || !_a.accepted && !_b.accepted) {
            if (_a.name.toLowerCase() > _b.name.toLowerCase())
                return 1;
            if (_a.name.toLowerCase() < _b.name.toLowerCase())
                return -1;
            return 0;
        }
        if (_a.accepted)
            return 1;
        return -1;
    }
    function addPlayer(_player) {
        let li = document.createElement("li");
        li.innerText = _player.name;
        let buttonRemovePlayer = document.createElement("input");
        buttonRemovePlayer.type = "button";
        buttonRemovePlayer.name = "removePlayer";
        let buttonOPPlayer = document.createElement("input");
        buttonOPPlayer.type = "button";
        buttonOPPlayer.name = "OP";
        li.appendChild(buttonOPPlayer);
        li.appendChild(buttonRemovePlayer);
        if (_player.operator) {
            buttonOPPlayer.classList.add("op");
        }
        if (!_player.accepted) {
            li.classList.add("unaccepted");
        }
        li.setAttribute("uuid", _player.uuid);
        ulPlayerList.appendChild(li);
    }
})(RealmPage || (RealmPage = {}));
//# sourceMappingURL=players.js.map