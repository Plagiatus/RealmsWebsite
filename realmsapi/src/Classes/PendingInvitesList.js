const ValueObject = require("./ValueObject");
const PendingInvite = require("./PendingInvite");

class PendingInvitesList extends ValueObject{
    constructor(unparsedJSON,client){
        super();
        try {
            let parsedJSON = JSON.parse(unparsedJSON);
            this.client = client;
            /**
             * @type {PendingInvite[]}
             */
            this.invites = [];
            parsedJSON.invites.forEach(invite => {
                this.invites.push(new PendingInvite(invite,this.client))
            });
        } catch (e) {
            console.error("Could not parse PendingInvitesList: " + e);
        }
    }
    getInvite(id){
        return this.invites.find(invite => invite.invitationId == id);
    }
}
module.exports = PendingInvitesList;