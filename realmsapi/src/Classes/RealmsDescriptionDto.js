const ValueObject = require("./ValueObject");
const RealmsServer = require("./RealmsServer");

class RealmsDescriptionDto extends ValueObject{
    /**
     * 
     * @param {String} name 
     * @param {String} description 
     * @param {RealmsServer} world 
     */
    constructor(name,description,world){
        super();
        this.name = name;
        this.description = description;
        /**
         * @private
         */
        this.world = world;
    }
    setName(name){
        this.name = name;
        this.world.client.setDesctiption(this)
        return this.world;
    }
    setDescription(description){
        this.description = description;
        this.world.client.setDesctiption(this)
        return this.world;
    }
    setProperties(name,description){
        this.name = name;
        this.description = description;
        this.world.client.setDesctiption(this)
        return this.world;
    }
}
module.exports = RealmsDescriptionDto;