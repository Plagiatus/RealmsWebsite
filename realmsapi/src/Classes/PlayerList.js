const ValueObject = require('./ValueObject');


class PlayerList extends ValueObject{
    constructor(unparsedJSON){
        super();
            try{
                var parsedJSON = JSON.parse(unparsedJSON);
                this.players = parsedJSON;
            }catch(e){
                console.error("Could not parse PlayerList: "+e);
            }
    }
}