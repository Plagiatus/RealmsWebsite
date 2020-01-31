const Client = require('../Client/Methods');
const PlayerInfo = require("./PlayerInfo");
const ValueObject = require("./ValueObject");
const RealmsWorldOptions = require("./RealmsWorldOptions");
const RealmsDescriptionDto = require("./RealmsDescriptionDto");
const RealmsServerAddress = require("./RealmsServerAddress");
const WorldDownload = require("./WorldDownload");
const UploadInfo = require("./UploadInfo");
const BackupList = require("./BackupList");
const RealmsWorldResetDto = require("./RealmsWorldResetDto");

class RealmsServer extends ValueObject{
    /**
     * @param {String} unparsedJSON 
     * @param {Client} client
     */
    constructor(unparsedJSON,client){
        super();
        try{
            /**
             * @type {Client}
             */
            this.client = client;
            /**
             * @type {JSON}
             */
            let parsedJSON = JSON.parse(unparsedJSON);
            /**
             * @type {Number}
             */
            this.id = parsedJSON.id;
            /**
             * @type {Number}
             */
            this.remoteSubscriptionId = parsedJSON.remoteSubscriptionId;
            /**
             * @type {String}
             */
            this.owner = parsedJSON.owner;
            /**
             * @type {String}
             */
            this.ownerUUID = parsedJSON.ownerUUID;
            /**
             * @type {RealmsDescriptionDto}
             */
            this.properties = new RealmsDescriptionDto(parsedJSON.name,parsedJSON.motd,this);
            /**
             * @type {String}
             */
            this.defaultPermission = parsedJSON.defaultPermission;
            /**
             * @type {String}
             */
            this.state = parsedJSON.state;
            /**
             * @type {Number}
             */
            this.daysLeft = parsedJSON.daysLeft;
            /**
             * @type {Boolean}
             */
            this.expired = parsedJSON.expired;
            /**
             * @type {Boolean}
             */
            this.expiredTrial = parsedJSON.expiredTrial;
            /**
             * @type {Boolean}
             */
            this.gracePeriod = parsedJSON.gracePeriod;
            /**
             * @type {String}
             */
            this.worldType = parsedJSON.worldType;
            /**
            * @type {PlayerInfo[]}
            */
            this.players = [];
            if (parsedJSON.players != null){
                parsedJSON.players.forEach(player => {
                    this.players.push(new PlayerInfo(player,this));
                });
            }
            /**
             * @type {Number}
             */
            this.maxPlayers = parsedJSON.maxPlayers;
            /**
             * @type {String}
             */
            this.minigameName = parsedJSON.minigameName;
            /**
             * @type {Number}
             */
            this.minigameId = parsedJSON.minigameId;
            /**
             * @type {String}
             */
            this.minigameImage = parsedJSON.minigameImage;
            /**
             * @type {Number}
             */
            this.activeSlot = parsedJSON.activeSlot;
            /**
             * @type {Map<Number,RealmsWorldOptions>}
             */
            this.slots = parsedJSON.slots;
            if (parsedJSON.slots){
                let slots = new Map();
                for (let i=1;i<=3;i++){
                    slots.set(i,RealmsWorldOptions.parse(parsedJSON.slots[i-1].options));
                }
                this.slots = slots
            }
            /**
             * @type {Boolean}
             */
            this.member = parsedJSON.member;
            /**
             * @type {Number}
             */
            this.clubId = parsedJSON.clubId;
        }catch(e){
            console.error("Could parse RealmsServer: "+ e);
        }
    }
    /**
     * Sorts players by alphabetic and Invite accepts
     * @returns {RealmsServer}
     */
    sortPlayers(){
        this.players.sort(function(a, b){
            if (a.accepted != b.accepted){
                return Number(b.accepted) - Number(a.accepted);
            } else {
                if (a.name.toLowerCase() > b.name.toLowerCase()){
                    return 1;
                }
                if (a.name.toLowerCase() < b.name.toLowerCase()){
                    return -1;
                }
                return 0;
            }
        });
        return this;
    }
    /**
     * @returns {RealmsServer} detail information (Only if you owner)
     */
    detailInformation(){
        return new RealmsServer(this.client.world(this.id),this.client);
    }
    /**
     * 
     * @param {String} username Player username for invite
     * @returns {RealmsServer} Updated Realms server with new Player if existed
     */
    invitePlayer(username){
        return new RealmsServer(this.client.invitePlayer(this.id,username),this.client);
    }
    /**
     * 
     * @param {String} uuid Search player by UUID in RealmsServer
     * @returns {PlayerInfo} 
     */
    getPlayerByUUID(uuid){
        return this.players.find(playerInfo => playerInfo.uuid.toLowerCase() == uuid.toLowerCase());
    }
    /**
     * 
     * @param {String} name Search player by Name in RealmsServer
     * @returns {PlayerInfo}
     */
    getPlayerByName(name){
        return this.players.find(playerInfo => playerInfo.name.toLowerCase() == name.toLowerCase());
    }
    /**
     * 
     * @returns {RealmsServerAddress}
     */
    get joinCreditails(){
            return new RealmsServerAddress(this.client.joinToWorld(this.id));
    }
    /**
     * 
     * @param {number} slot 
     */
    changeSlot(slot){
        if (slot == this.activeSlot && !this.minigameId){
            console.error("Slot is already set");
        }else{
            this.client.setSlot(this.id,slot);
            return this.detailInformation();
        }
    }
    /**
     * @returns {Boolean}
     */
    open(){
        return this.client.openRealm(this.id);
    }
    /**
     * @returns {Boolean}
     */
    close(){
        return this.client.closeRealm(this.id);
    }
    download(slot){
        return new WorldDownload(this.client.download(this.id,slot));
    }
    downloadActiveSlot(){
        return this.download(this.activeSlot);
    }
    /**
     * @returns {UploadInfo}
     */
    upload(){
        return new UploadInfo(this.client.uploadInfo(this.id));
    }
    /**
     * 
     * @param {Number|String} minigameId 
     * @returns {Boolean}
     */
    setMinigame(minigameId){
        return this.client.setMinigame(this.id,minigameId);
    }
    backups(){
        return new BackupList(this.client.backups(this.id),this)
    }
    /**
     * 
     * @param {Number} id 
     * @returns {Boolean}
     */
    setTemplate(id){
        let realmsworldresetdto = new RealmsWorldResetDto(null, id, -1, false)
        return this.client.resetWorld(this.id,realmsworldresetdto);
    }
    createNewWorld(seed,levelType,generateStructures){
        let realmsworldresetdto = new RealmsWorldResetDto(seed, -1, levelType, generateStructures);
        return this.client.resetWorld(this.id,realmsworldresetdto);
    }
}
module.exports = RealmsServer;