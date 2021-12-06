
class Repository {
    constructor() {
        if (!Repository.instance) {
            Repository.instance = this
            console.log("Repository instantiated")
            this.dht = {
                ip: null,
                port: null,
                backIP: null,
                backPort: null,
                nextIP: null,
                nextPort: null,
            }
            this.messageId = {};
            this.fileMap = new Map();
        }
        // Initialize object
        return Repository.instance
    }

    // --------------------------------------------------
    // DHT
    getDHT() {
        return this.dht;
    }

    setDHT(dht) {
        console.debug("Initial parameters loaded, data = ", JSON.stringify(dht))
        this.dht = { ...dht }
    }

    setDHTBack(backIP, backPort) {
        console.debug(`Modifying DHT back parameters, backIP:backPort = ${backIP}:${backPort}`)
        this.dht.backIP = backIP;
        this.dht.backPort = backPort;
    }

    setDHTNext(nextIP, nextPort) {
        console.debug(`Modifying DHT next parameters, nextIP:nextPort = ${nextIP}:${nextPort}`)
        this.dht.nextIP = nextIP;
        this.dht.nextPort = nextPort;
    }
    // --------------------------------------------------

    // --------------------------------------------------
    // MessageId
    getMessageId(name) {
        return this.messageId[name];
    }

    addMessageId(name, value, lifespan) {
        this.messageId[name] = value;
        setTimeout(() => {
            this.deleteMessageId(name);
        }, lifespan);
    }

    deleteMessageId(name) {
        try {
            delete this.messageId[name];
        } catch (e) {
            console.debug(name, "already deleted");
        }
    }
    // --------------------------------------------------

    // --------------------------------------------------
    // TrackerCount
    getTrackerCount() {
        return this.trackerCount;
    }

    setTrackerCount(trackerCount) {
        this.trackerCount = trackerCount;
    }

    clearCount() {
        this.trackerCount = undefined;
    }
    // --------------------------------------------------

    // --------------------------------------------------
    // Files
    getFileMapElement(fileId) {
        return this.fileMap.get(fileId);
    }

    getFileList() {
        const iter = this.fileMap.values();
        const list = [];
        for (const { id, filename, filesize } of iter) {
            list.push({ id, filename, filesize });
        }
        return list;
    }

    getFileListWithPares() {
        const iter = this.fileMap.values();
        const list = [];
        for (const { id, filename, filesize, pares } of iter) {
            list.push({ id, filename, filesize, pares });
        }
        return list;
    }

    storeFile(file, pares) {
        this.fileMap.set(file.id, {
            ...file,
            pares
        });
    }

    addPar(fileId, par) {
        this.fileMap.get(fileId).pares.push(par);
    }

    getFileCount() {
        return this.fileMap.size;
    }
    // --------------------------------------------------
}

const instance = new Repository();

module.exports = instance;
