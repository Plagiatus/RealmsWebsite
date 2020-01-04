const ValueObject = require("./ValueObject");
const Backup = require("./Backup");

class BackupList extends ValueObject{
    constructor(unparsedJSON,world){
        super();
        try {
            this.world = world;

            let parsedJSON = JSON.parse(unparsedJSON);
            /**
             * @type {Backup[]}
             */
            this.backups = [];
            parsedJSON.backups.forEach(backup => {
                this.backups.push(new Backup(backup,this.world))
            });
        } catch (e) {
            console.error("Could not parse BackupList: " + e);
        }
    }
    getBackup(backupId){
        this.backups.find(backup => backup.backupId == backupId);
    }
}
module.exports = BackupList;