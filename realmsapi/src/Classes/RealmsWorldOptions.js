const ValueObject = require("./ValueObject");

class RealmsWorldOptions extends ValueObject{
    constructor(pvp,spawnAnimals,spawnMonsters,spawnNPCs,spawnProtection,commandBlocks,difficulty,gameMode,forceGameMode,slotName){
        super();
        //{\"slotName\":null,\"pvp\":true,\"spawnAnimals\":true,\"spawnMonsters\":true,\"spawnNPCs\":true,\"spawnProtection\":0,\"commandBlocks\":true,\"forceGameMode\":false,\"gameMode\":0,\"difficulty\":1,\"worldTemplateId\":-1,\"worldTemplateImage\":null,\"adventureMap\":false,\"resourcePackHash\":null,\"incompatibilities\":[],\"versionRef\":\"d27fed02242a5169dfc05aff5027450107a35d4d\",\"versionLock\":false,\"cheatsAllowed\":false,\"texturePacksRequired\":false,\"enabledPacks\":{\"resourcePacks\":[],\"behaviorPacks\":[]},\"customGameServerGlobalProperties\":null}
        try {
            //let parsedJSON = JSON.parse(unparsedJSON);
            this.pvp = pvp;
            this.spawnAnimals = spawnAnimals;
            this.spawnMonsters = spawnMonsters;
            this.spawnNPCs = spawnNPCs;
            this.spawnProtection = spawnProtection;
            this.commandBlocks = commandBlocks;
            this.difficulty = difficulty;
            this.gameMode = gameMode;
            this.forceGameMode = forceGameMode;
            this.slotName = slotName;
        } catch (error) {
            console.error("Could not create RealmsWorldOptions: "+ e );
        }
    }
    static parse(unparsedJSON){
        
        try {
            let parsedJSON = JSON.parse(unparsedJSON);
            var realmsworldoptions = new RealmsWorldOptions(parsedJSON.pvp,parsedJSON.spawnAnimals,parsedJSON.spawnAnimals,parsedJSON.spawnNPCs,parsedJSON.spawnProtection,parsedJSON.commandBlocks,parsedJSON.difficulty,parsedJSON.gameMode,parsedJSON.forceGameMode,parsedJSON.slotName);    
            realmsworldoptions.templateId = parsedJSON.worldTemplateId || -1;
            realmsworldoptions.templateImage = parsedJSON.worldTemplateImage || null;
            realmsworldoptions.adventureMap = parsedJSON.adventureMap || false;
        } catch (error) {
            console.error("Could not parse RealmsWorldOptions: "+ e);
        }
        return realmsworldoptions;
    }
    static getEmptyDefaults() {
        let realmsworldoptions = new RealmsWorldOptions(true, true, true, true, 0, false, 2, 0, false, "");
        realmsworldoptions.setEmpty(true);
        return realmsworldoptions;
    }
    /**
     * 
     * @param {Boolean} empty 
     */
    setEmpty(empty) {
        this.empty = empty;
     }
    
}
module.exports = RealmsWorldOptions;