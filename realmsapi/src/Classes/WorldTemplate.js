const ValueObject = require("./ValueObject");

class WorldTemplate extends ValueObject{
    constructor(parsedJSON){
        super();
        try{
            this.id = parsedJSON.id;
            this.name = parsedJSON.name;
            this.version = parsedJSON.version;
            this.author = parsedJSON.author;
            this.image = parsedJSON.image;
            this.trailer = parsedJSON.trailer;
            this.recommendedPlayers = parsedJSON.recommendedPlayers;
            this.type = parsedJSON.type;
        }catch(e){
            console.error("Could not parse WorldTemplate: "+e);
        }
    }
}
module.exports = WorldTemplate;