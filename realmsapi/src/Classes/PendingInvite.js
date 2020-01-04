const ValueObject = require("./ValueObject");
const Client = require('../Client/Methods');

class PendingInvite extends ValueObject{
    constructor(parsedJSON,client){
        super();
        try {
            /**
             * @type {Client}
             */
            this.client = client;

            this.invitationId = parsedJSON.invitationId;
            this.worldName = parsedJSON.worldName;
            this.worldDescription = parsedJSON.worldDescription;
            this.worldOwnerName = parsedJSON.worldOwnerName;
            this.worldOwnerUuid = parsedJSON.worldOwnerUuid;
            this.date = new Date(parsedJSON.date);
        } catch (e) {
            console.error("Could not parse PendingInvite: " + e);
        }
    }
    accept(){
        this.client.acceptInvite(this.invitationId);
    }
    reject(){
        this.client.rejectInvite(this.invitationId);
    }
}
module.exports = PendingInvite;