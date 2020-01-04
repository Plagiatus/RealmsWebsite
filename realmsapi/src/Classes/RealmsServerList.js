const RealmsServer = require("./RealmsServer");
const ValueObject = require("./ValueObject");


class RealmsServerList extends ValueObject{
    constructor(unparsedJSON,client){
        super();
        //console.log(unparsedJSON);
        try{
            
            let json = JSON.parse(unparsedJSON);
            var _servers = json["servers"];
            var servers = [];
            _servers.forEach(server => {
                servers.push(new RealmsServer(JSON.stringify(server),client))
            });
            /**
             * @type {RealmsServer[]}
             */
            this.servers = servers;
            this.client = client;
        }catch(e){
            console.error("Could not parse McoServerList: "+e);
        }
        return this;
    }
    /**
     * @param {Number} id
     * @returns {RealmsServer} 
     */
    getWorld(id){
        return this.servers.find(server => server.id == id);
    }

}


module.exports = RealmsServerList;