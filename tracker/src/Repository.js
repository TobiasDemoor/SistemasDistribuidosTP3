
class Repository {
    constructor () {
      if (!Repository.instance) {
        Repository.instance = this
        console.log("Repository instantiated")
        this.dht = {}
        this.messageId = {};
        this.fileList = {};
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
        console.log("Initial parameters loaded, data = ", JSON.stringify(dht))
        this.dht = { ...dht }
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
            try {
                delete this.messageId[name];
            } catch (e) {
                console.debug(name, "already deleted");
            }
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
    // --------------------------------------------------

    // --------------------------------------------------
    // Files
    getFileList() {
        return this.fileList;
    }

    storeFile(file, par) {
        this.fileList[file.id] = {
            ...file,
            pares: [ par ]
        };
    }

    addPar(fileId, par) {
        this.fileList[fileId].pares.push(par);
    }

    getFileCount() {
        return Object.keys(this.fileList).length;
    }
    // --------------------------------------------------
}
  
const instance = new Repository()

module.exports = instance;