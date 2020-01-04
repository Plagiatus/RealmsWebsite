const ValueObject = require("./ValueObject");


class RealmsWorldResetDto extends ValueObject{
    constructor(seed,worldTemplateId,levelType,generateStructures){
        super();
        this.seed = seed;
        this.worldTemplateId = worldTemplateId;
        this.levelType = levelType;
        this.generateStructures = generateStructures;
    }
}
module.exports = RealmsWorldResetDto;