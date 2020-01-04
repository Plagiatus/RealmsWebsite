
class FileSize{
    constructor(bytes){
        this.size = bytes;
    }
    static bytes(bytes){
        return new FileSize(bytes);
    }
    toString(){
        if (this.size < 1024){
            return this.size+"B";
        }else{
            let i = Math.floor(Math.log(this.size) / Math.log(1024));
            return Math.floor((this.size / Math.pow(1024, i))*10)/10+"KMGTPEZY"[i - 1]+"B";
        }
    }
}
module.exports = FileSize;