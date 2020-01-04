const RealmsClient = require("./Methods")
const RealmsServerList = require("../Classes/RealmsServerList");
const RealmsServer = require("../Classes/RealmsServer");
const PendingInvitesList = require("../Classes/PendingInvitesList");
const RealmsTemplatePaginatedList = require("../Classes/WorldTemplatePaginatedList");
const RealmsNews = require("../Classes/RealmsNews");

class Realms{
    constructor (accessToken,version,username){
        this.client = new RealmsClient(accessToken,version,username);
    }
    
    /**
     * @returns {Boolean}
     */
    get trial(){
        return this.client.trial();
    }
    get availability(){
        return this.client.checkAvailable();
    }
    get compatible(){
        return this.client.checkCompatiables();
    }
    get invitesCount(){
        return this.client.invitesCount();
    }
    get worlds(){
        return new RealmsServerList(this.client.worlds(),this.client);
    }
    get news(){
        return new RealmsNews(this.client.news());
    }
    /**
     * 
     * @param {String} type 
     * The type of the Template `MINIGAME`, `ADVENTUREMAP`, `NORMAL`, `EXPERIENCE`, or `INSPIRATION`.
     * @param {*} page 
     * @param {*} size 
     */
    templates(type,page,size){
        return new RealmsTemplatePaginatedList(this.client.templates(type,page,size));
    }
    /*world(id){
        return new RealmsServer(this.client.world(id),this.client);
    }*/
    get invites(){
        return new PendingInvitesList(this.client.invites(),this.client);
    }
    get activities(){
        return this.client.activities();
    }
}
module.exports = Realms;