const ValueObject = require("./ValueObject");

class UploadInfo extends ValueObject{
    constructor(unparsedJSON){
        super();
        try {
            let parsedJSON = JSON.parse(unparsedJSON);
            this.worldClosed = parsedJSON.worldClosed;
            this.token = parsedJSON.token;
            this.uploadEndpoint = parsedJSON.uploadEndpoint;
            this.port = parsedJSON.port;
        } catch (e) {
            console.error("Could not parse UploadInfo: "+ e)
        }
    }
}
module.exports = UploadInfo;