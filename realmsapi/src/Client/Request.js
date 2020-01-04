var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

class Request{
    /**
     * 
     * @param {String} token 
     * @param {String} uuid 
     * @param {String} version 
     * @param {String} username 
     */
    constructor(token,uuid,version,username){
        this.token = token;
        this.uuid = uuid;
        this.version = version;
        this.username = username;
        this.endpoint = "https://pc.realms.minecraft.net"
    }
    get cookieHeader(){
        return `sid=token:${this.token}:${this.uuid};user=${this.username};version=${this.version}`
    }
    get(url){
        var request = new XMLHttpRequest();
        //console.log(this.endpoint+url+" >> "+this.cookieHeader)
        try{
            request.open("GET",this.endpoint+url,false)
            request.setDisableHeaderCheck(true);
            request.setRequestHeader("Cookie",this.cookieHeader);
            request.send(null);
            if (request.status == 401){
                throw new Error("Could not autorize you against to Realms: " + request.getResponseHeader("WWW-Authenticate"));
                //return;
            }
            return request.responseText
        }catch(e){
            throw e;
        }
    }
    post(url,payload){
        var request = new XMLHttpRequest();
        try{
            request.open("POST",this.endpoint+url,false)
            request.setDisableHeaderCheck(true);
            request.setRequestHeader("Cookie",this.cookieHeader);
            request.setRequestHeader("Content-Type","application/json");
            request.send(payload);
            if (request.status == 401){
                throw new Error("Could not autorize you agains to Realms: " + request.getResponseHeader("WWW-Authenticate"));
            }
            return request.responseText
        }catch(e){
            throw e;
        }
    }
    put(url){
        var request = new XMLHttpRequest();
        try{
            request.open("PUT",this.endpoint+url,false)
            request.setDisableHeaderCheck(true);
            request.setRequestHeader("Cookie",this.cookieHeader);
            request.send(null);
            if (request.status == 401){
                throw new Error("Could not autorize you agains to Realms: " + request.getResponseHeader("WWW-Authenticate"));
            }
            return request.responseText
        }catch(e){
            throw e;
        }
    }
    delete(url){
        var request = new XMLHttpRequest();
        try{
            request.open("DELETE",this.endpoint+url,false)
            request.setDisableHeaderCheck(true);
            request.setRequestHeader("Cookie",this.cookieHeader);
            request.send(null);
            if (request.status == 401){
                throw new Error("Could not autorize you agains to Realms: " + request.getResponseHeader("WWW-Authenticate"));
            }
            return request.responseText
        }catch(e){
            throw e;
        }
    }
}
module.exports = Request;