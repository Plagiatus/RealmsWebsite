const ValueObject = require("./ValueObject");
const WorldTemplate = require("./WorldTemplate");

class WorldTemplatePaginatedList extends ValueObject{
    constructor(unparsedJSON){
        super();
        try {
            let parsedJSON = JSON.parse(unparsedJSON);
            this.size = parsedJSON.size || 0;
            this.page = parsedJSON.page || 0;
            this.total = parsedJSON.total || 0;
            /**
             * @type {WorldTemplate[]}
             */
            this.templates = [];
            for(let i=0;i<parsedJSON.templates.length;i++){
                this.templates.push(new WorldTemplate(parsedJSON.templates[i]));
            }
        } catch (e) {
            
        }
    }
    getTemplate(id){
        return this.templates.find(template => template.id == id);
    }
}
module.exports = WorldTemplatePaginatedList;