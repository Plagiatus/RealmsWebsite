class ValueObject{
    /**
     * @override
     * @returns {String} String from JSON Class
     */
    toString(){
        var jsonClass = {};
        for (let field in this){
            //Ignoreable fields for JSON
            if (field == "world") continue;
            if (field == "client") continue;
            jsonClass[field] = this[field]
        }
        return JSON.stringify(jsonClass)
    }
    /**
     * @override
     * @returns {JSON} JSON object
     */
    toJSON(){
        return JSON.parse(this.toString());
    }
}
module.exports = ValueObject;