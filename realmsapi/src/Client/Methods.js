const Request = require('./Request');

const RealmsServer = require("../Classes/RealmsServer");
const PlayerInfo = require('../Classes/PlayerInfo');
const RealmsDesctiptionDto = require("../Classes/RealmsDescriptionDto");
const RealmsWorldResetDto = require("../Classes/RealmsWorldResetDto");
//const WorldType = require("../Classes/Enums").Templates;


class RealmsClient{
    /**
     * Main class for control Realms
     * @param {String} accessToken 
     * @param {String} version 
     * @param {String} username 
     */
    constructor (accessToken,version,username){
        this.accessToken = accessToken.split(":")[1];
        this.uuid = accessToken.split(":")[2];
        this.version = version;
        this.username = username;
        /**
         * @private
         */
        this.Request = new Request(this.accessToken,this.uuid,this.version,this.username);
    }
    //GET requests
    /**
     * @returns {Boolean}
     */
    checkAvailable() {
        return this.Request.get("/mco/available");
    }
    /**
     * @returns {Boolean}
     */
    checkCompatiables() {
        return this.Request.get("/mco/client/compatible");
    }
    /**
     * @returns {Number}
     */
    invitesCount(){
        return this.Request.get("/invites/count/pending");
    }
    /**
     * @returns {String}
     */
    invites(){
        return this.Request.get("/invites/pending");
    }
    /**
     * @returns {Boolean}
     */
    trial(){
        return this.Request.get("/trial");
    }
    news(){
        return this.Request.get("/mco/v1/news");
    }
    /**
     * @returns {String}
     */
    activities(){
        return this.Request.get("/activities/liveplayerlist");
    }
    /**
     * 
     * @param {Number} worldId 
     */
    subscriptions(worldId){
        return this.Request.get("/subscriptions/"+worldId);
    }
    /**
     * 
     * @param {Number} worldId 
     */
    joinToWorld(worldId){
        return this.Request.get("/worlds/v1/"+worldId+"/join/pc");
    }
    world(worldId){
        return this.Request.get("/worlds/"+worldId);
    }
    backups(worldId){
        return this.Request.get("/worlds/"+worldId+"/backups")
    }
    download(worldId,slot){
        return this.Request.get("/worlds/"+worldId+"/slot/"+slot+"/download")
    }
    
    /**
     * 
     * @param {String} type 
     * @param {Number} page 
     * @param {Number} size 
     */
    templates(type,page,size){
        return this.Request.get("/worlds/templates/"+type+"?page="+page+"&pageSize="+size);
    }
    /**
     * @returns {String}
     */
    worlds(){
        //console.log(this.Request.get("/worlds"))
        return this.Request.get("/worlds");
    }
    //PUT requests
    /**
     * 
     * @param {Number} worldId 
     * @param {Number} minigameId 
     * @returns {Boolean}
     */
    setMinigame(worldId,minigameId){
        return this.Request.put("/worlds/minigames/"+minigameId+"/"+worldId);
    }
    /**
     * 
     * @param {Number} slot 
     */
    setSlot(worldId,slot){
        return this.Request.put("/worlds/"+worldId+"/slot/"+slot);
    }
    acceptInvite(invitationId){
        return this.Request.put("/invites/accept/"+invitationId);
    }
    rejectInvite(invitationId){
        return this.Request.put("/invites/reject/"+invitationId);
    }
    openRealm(worldId){
        return this.Request.put("/worlds/"+worldId+"/open");
    }
    closeRealm(worldId){
        return this.Request.put("/worlds/"+worldId+"/close");
    }
    uploadInfo(worldId){
        return this.Request.put("/worlds/"+worldId+"/backups/upload")
    }
    //DELETE Requests
    kickPlayer(worldId,UUID){
        return this.Request.delete("/invites/"+worldId+"/invite/"+UUID);
    }
    deopPlayer(worldId,UUID){
        return this.Request.delete("/ops/"+worldId+"/"+UUID);
    }
    //POST Requests
    makeOp(worldId,UUID){
        return this.Request.post("/ops/"+worldId+"/"+UUID);
    }
    invitePlayer(worldId,username){
        return this.Request.post("/invites/"+worldId,`{"name":"${username}"}`);
    }
    /**
     * 
     * @param {Number} worldId 
     * @param {RealmsDesctiptionDto} realmsworldresetdto 
     */
    resetWorld(worldId,realmsworldresetdto){
        return this.Request.post("/worlds/"+worldId+"/reset",realmsworldresetdto.toString());
    }
    /**
     * 
     * @param {RealmsDesctiptionDto} realmsdesctiptiondto
     */
    setDescription(realmsdesctiptiondto){
        return this.Request.post("/worlds/"+realmsdesctiptiondto.world.id,realmsdesctiptiondto+"");
    }

}
module.exports = RealmsClient;
