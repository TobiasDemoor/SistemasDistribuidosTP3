const fs = require('fs');
const sha1 = require('sha1');
const path = require('path');


class Repository {
    constructor() {
        if (!Repository.instance) {
            Repository.instance = this
            console.log("Repository instantiated")
            this.downloads = null;
            this.fileMap = new Map();
        }
        // Initialize object
        return Repository.instance
    }

    setInit(downloads, ip, tcpPort, udpPort) {
        this.downloads = path.resolve(downloads);
        this.ip = ip;
        this.tcpPort = tcpPort;
        this.udpPort = udpPort;
        this.fileMap = new Map();
        fs.readdirSync(this.downloads).forEach(
            filename => this.addFileToMap(filename)
        );
        console.log(this.fileMap)
    }

    getDownloadsPath() {
        return this.downloads;
    }

    getIP() {
        return this.ip;
    }

    getTCPPort() {
        return this.tcpPort;
    }

    getUDPPort() {
        return this.udpPort;
    }

    getFilePath(hash) {
        return path.resolve(this.downloads + "/" + this.fileMap.get(hash));
    }

    addFileToMap(filename) {
        const i = filename.indexOf('-');
        this.fileMap.set(sha1(filename.substring(i+1) + filename.substring(0, i)), filename);
    }
}


const instance = new Repository()

module.exports = instance;

