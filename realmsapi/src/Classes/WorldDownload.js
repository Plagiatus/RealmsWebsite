const ValueObject = require("./ValueObject");
const https = require("https");
const fs = require("fs");
const FileSize = require("../Utils/FileSize");

const EventEmitter = require('events');

class RealmsEmitter extends EventEmitter {}
const downloadEmitter = new RealmsEmitter();


class WorldDownload extends ValueObject {
    constructor(unparsedJSON) {
        super();
        try {
            let parsedJSON = JSON.parse(unparsedJSON);
            this.downloadLink = parsedJSON.downloadLink || "";
            this.resourcePackUrl = parsedJSON.resourcePackUrl || "";
            this.resourcePackHash = parsedJSON.resourcePackHash || "";
            this.donwloadEvent = downloadEmitter;
        } catch (error) {
            console.error("Could not parse WorldDownload: " + e);
        }
    }
    /**
     * 
     * @param {String} path 
     */
    downloadWorld(path) {
        let downloadedSize = 0;
        let request = https.get(this.downloadLink)
        request.on('response', (response) => {
            let len = Number(response.headers['content-length']);
            console.log("Starting download " + FileSize.bytes(len));
            response.on('data', (data) => {
                downloadEmitter.emit('data',downloadedSize,data);
                downloadedSize += data.length;
                fs.appendFileSync(path+"/world.tar.gz", data);
            });
        });
        return downloadEmitter;
    }
}
module.exports = WorldDownload;