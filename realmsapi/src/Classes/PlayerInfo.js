const Request = require("../Client/Request")
const ValueObject = require("./ValueObject");
const RealmsServer = require("./RealmsServer");
const Ops = require("./Ops")

class PlayerInfo extends ValueObject{
    /**
     * 
     * @param {JSON} parsedJSON 
     * @param {RealmsServer} realmsServer 
     */
    constructor(parsedJSON,realmsServer){
        super();
        try{
            /**
             * @type {RealmsServer}
             */
            this.world = realmsServer;
            this.client = realmsServer.client;
            this.name = parsedJSON.name || "";
            this.uuid = parsedJSON.uuid || "";
            this.operator = parsedJSON.operator || false;
            this.accepted = parsedJSON.accepted || false;
            this.online = parsedJSON.online || false;
        }catch(e){
            console.error("Could not parse PlayerInfo: "+e);
        }
    }
     /**
     * 
     * @param {PlayerInfo} playerInfo
     */
    makeOp(){
        return new Ops(this.client.makeOp(this.world.id,this.uuid),this.world);
    }
    deopPlayer(){
        return new Ops(this.client.deopPlayer(this.world.id,this.uuid),this.world);
    }
    kickPlayer(){
        this.client.kickPlayer(this.world.id,this.uuid);
        return this.world.detailInformation();
    }
}
module.exports = PlayerInfo;