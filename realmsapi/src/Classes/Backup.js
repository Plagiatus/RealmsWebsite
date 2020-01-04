const ValueObject = require("./ValueObject");
const FileSize = require("../Utils/FileSize");

class Backup extends ValueObject{
    constructor(parsedJSON,world){
        super();
        this.world = world;
        this.backupId = parsedJSON.backupId;
        this.lastModifiedDate = new Date(parsedJSON.lastModifiedDate);
        this.size = FileSize.bytes(parsedJSON.size);
        this.metadata = {
            /**
             * @type {Number}
             */
            game_difficulty: parsedJSON.metadata.game_difficulty,
            name: parsedJSON.metadata.name,
            game_server_version: parsedJSON.metadata.game_server_version,
            enabled_packs: parsedJSON.metadata.enabled_packs,
            description: parsedJSON.metadata.description,
            game_mode: parsedJSON.metadata.game_mode,
            world_type: parsedJSON.metadata.world_type
        };
    }
}
module.exports = Backup;