"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("../MojangAPI/Player");
var RealmsServer;
(function (RealmsServer) {
    // let XMLHttpRequest 
    let pcRealmsURL = "https://pc.realms.minecraft.net/";
    let apiURL = "https://api.mojang.com/";
    let versionJSON = "https://launchermeta.mojang.com/mc/game/version_manifest.json";
    class Connection {
        constructor(_u, _sid, _v) {
            this.user = _u;
            this.sid = _sid;
            this.version = _v;
            this.getPlayerUUID(_u);
        }
        async getPlayerUUID(_p) {
            // let player: { id: string, name: string } = await Request(apiURL + "users/profiles/minecraft/" + _p, { json: true });
            // this.userUUID = player.id;
            // this.config = {
            //   url: pcRealmsURL + "worlds/templates/MINIGAME?page=6&pageSize=10",
            //   headers: {
            //     "Cookie": "sid=token:" + this.sid + ":" + this.userUUID + ";user=" + this.user + ";version=" + this.version
            //   }
            // }
            // console.log(this);
            // this.exRequest();
        }
        exRequest() {
            // let a: any = await 
            // Request(this.config, this.handleUUIDRequest.bind(this)).catch((_e) => {
            //   console.error(_e);
            // });
            // console.log(a);
        }
        handleUUIDRequest(_err, _res, _body) {
            if (_err) {
                return console.log(_err);
            }
            // console.log(_body);
            let body = JSON.parse(_body);
            for (let template of body.templates) {
                // if(template.owner == this.user){
                delete template.image;
                console.log(template.name);
                // }
            }
        }
    }
    // let c: Connection = new Connection("Plagiatus", "9e099770c212459ba1446d6ab6cf2fb4", "1.14.4");
    async function printStatus() {
        // let result: [Error, any] = await to(MojangAPI.API.getUUIDFromName("Plagiatus"));
        // if(result[0]) console.error(result[0]);
        // else console.log(result[1]);
    }
    printStatus();
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    async function testPlayer() {
        let player = new Player_1.Player();
        // await player.authenticate();
        // console.log(player);
        // await player.refreshToken();
        // await delay(2000);
        // await player.invalidate();
        // console.log("invalidated!");
        // await delay(2000);
        // console.log(await player.getRealmsInvitesCount())
        await player.validate();
        // console.log(player);
        // let result: [Error, Invite[]] = await to(player.getRealmsInvites());
        // console.log(result);
        let realms = await player.getOwnedRealms();
        // console.log(realms);
        let realm = realms[0];
        // await realm.get();
        // console.log(await realm.getBackups());
        // console.log(await realm.getBackupDownload(1));
        // let ops: string[] = await realm.getOPsUUIDs();
        // console.log(await MojangAPI.API.getNamesFromUUID(ops[2]));
        // console.log(await realm.getSubscription());
        // let templates: Templates = await realm.getTemplates(TEMPLATE_TYPE.MINIGAME);
        // for(let t of templates.templates){
        //   console.log(t.name);
        // }
        // await realm.invitePlayer("Plagypus");
        // await realm.removePlayer("64870cb3e3e14857bec6b9f597dc8b21");
        // console.log(realm);
        // for(let p of realm.players){
        //   if(p.operator){console.log(p)}
        // }
        // await realm.open();
        // console.log(realm.state);
        console.log(await realm.opPlayer("64870cb3e3e14857bec6b9f597dc8b21"));
        console.log(await realm.deopPlayer("64870cb3e3e14857bec6b9f597dc8b21"));
    }
    testPlayer();
    function to(_promise) {
        let result = [null, null];
        // @ts-ignore
        result = _promise.then(data => [null, data])
            .catch(err => [err, null]);
        // @ts-ignore
        return result;
    }
})(RealmsServer || (RealmsServer = {}));
