const ValueObject = require("./ValueObject");

class RealmsServerAddress extends ValueObject{
    constructor(unparsedJSON){
        super();
            try {
                let parsedJSON = JSON.parse(unparsedJSON);
                this.address = parsedJSON.address || null;
                this.resourcePackUrl = parsedJSON.resourcePackUrl || null;
                this.resourcePackHash = parsedJSON.resourcePackHash || null;
            } catch (e) {
                console.error("Could not parse RealmsServerAddress: " + e);
            }
            
    }
}
module.exports = RealmsServerAddress;