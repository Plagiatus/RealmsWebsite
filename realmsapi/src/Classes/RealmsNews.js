const ValueObject = require("./ValueObject");


class RealmsNews extends ValueObject{
    constructor(unparsedJSON,client){
        super();
        try{
            let parsedJSON = JSON.parse(unparsedJSON);
            this.client = client;
            this.newsLink = parsedJSON.newsLink;
        }catch(e){
            console.error("Could not parse RealmsNews: " + e);
        }
    }
    /*get newsLink(){
        return this.newsLink;
    }*/
}
module.exports = RealmsNews;