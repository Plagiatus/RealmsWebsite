const ValueObject = require("./ValueObject");
const RealmsServer = require("./RealmsServer");

class Ops extends ValueObject{
    constructor(unparsedJSON,world){
        super();
        try{
            let parsedJSON = JSON.parse(unparsedJSON);
            this.ops = parsedJSON.ops
            /**
             * @type {RealmsServer}
             */
            this.world = world
        }catch(e){
            console.error("Could not parse Ops "+e);
        }
    }
}
module.exports = Ops