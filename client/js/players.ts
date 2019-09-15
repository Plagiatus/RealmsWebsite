namespace RealmPage {
  window.addEventListener("load", initPlayersElements);
  let ulPlayerList: HTMLUListElement;
  let inputNewPlayer: HTMLInputElement;
  let buttonNewPlayer: HTMLInputElement;

  function initPlayersElements() {
    ulPlayerList = <HTMLUListElement>document.getElementsByClassName("PlayerList")[0];
    inputNewPlayer = <HTMLInputElement>document.getElementById("RealmInvite");
    buttonNewPlayer = <HTMLInputElement>document.getElementById("RealmAddPlayer");

    buttonNewPlayer.addEventListener("click", addNewPlayer);
    ulPlayerList.addEventListener("click", modifyPlayer);
  }

  async function addNewPlayer() {
    await invitePlayer(player, realms[0], inputNewPlayer.value);
    let uuid: string = await getUUID(inputNewPlayer.value);
    let invitedPlayer: PlayerOnServer = { name: inputNewPlayer.value, uuid: uuid, accepted: false, online: false, operator: false, permission: "MEMBER" };
    addPlayer(invitedPlayer);
  }

  async function modifyPlayer(_e: MouseEvent) {
    if (_e.target instanceof HTMLInputElement) {
      let target: HTMLInputElement = _e.target;
      let uuid: string = target.parentElement.getAttribute("uuid");
      switch (target.name) {
        case "OP":
          if (target.classList.contains("op")) {
            deopPlayer(player, realms[0], uuid);
            target.classList.remove("op");
          } else {
            opPlayer(player, realms[0], uuid);
            target.classList.add("op");
          }
          break;
        case "removePlayer":
          await removePlayer(player, realms[0], uuid);
          target.parentElement.parentElement.removeChild(target.parentElement);
          break;
      }
    }
  }

  export function updatePlayerDisplay(_players: PlayerOnServer[]) {
    ulPlayerList.innerHTML = "";
    _players = _players.sort(sortPlayers);
    for (let p of _players) {
      addPlayer(p);
    }
  }

  function sortPlayers(_a: PlayerOnServer, _b: PlayerOnServer) {
    if (_a.accepted && _b.accepted || !_a.accepted && !_b.accepted) {
      if (_a.name.toLowerCase() > _b.name.toLowerCase()) return 1;
      if (_a.name.toLowerCase() < _b.name.toLowerCase()) return -1;
      return 0;
    }
    if (_a.accepted) return 1;
    return -1;
  }

  function addPlayer(_player: PlayerOnServer) {
    let li: HTMLLIElement = document.createElement("li");
    li.innerText = _player.name;
    let buttonRemovePlayer: HTMLInputElement = document.createElement("input");
    buttonRemovePlayer.type = "button";
    buttonRemovePlayer.name = "removePlayer";
    let buttonOPPlayer: HTMLInputElement = document.createElement("input");
    buttonOPPlayer.type = "button";
    buttonOPPlayer.name = "OP";
    li.appendChild(buttonOPPlayer);
    li.appendChild(buttonRemovePlayer);

    if (_player.operator) {
      buttonOPPlayer.classList.add("op");
    }
    if (!_player.accepted) {
      li.classList.add("unaccepted")
    }

    li.setAttribute("uuid", _player.uuid);
    ulPlayerList.appendChild(li);
  }

}