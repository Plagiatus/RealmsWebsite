var MojangAPI;
(function (MojangAPI) {
    class Player {
        // password: string;
        constructor() { }
        getUUID() { }
        getName() { }
        authenticate() { }
        refreshToken() { }
        validate() { }
        signout() { }
        invalidate() { }
        getNameHistory() { }
        setSkin() { }
        resetSkin() { }
        getRealmsInviteAmount() { }
    }
    MojangAPI.Player = Player;
})(MojangAPI || (MojangAPI = {}));
var MojangAPI;
(function (MojangAPI) {
    class Realm {
        getIP() { }
        getBackups() { }
        getOPsUUIDs() { }
        getSubscription() { }
        invitePlayer(_player) { }
        removePlayer(_player) { }
        opPlayer(_player) { }
        deopPlayer(_player) { }
        switchToSlot(_s) { }
        getDownload(_s) { }
        resetActiveSlot() { }
        static getMinigames() { }
        switchToMinigame(_m) { }
    }
    MojangAPI.Realm = Realm;
})(MojangAPI || (MojangAPI = {}));
