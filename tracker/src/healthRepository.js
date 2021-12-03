class HealthRepository {
    constructor() {
        if (!HealthRepository.instance) {
            HealthRepository.instance = this;
            console.log("HealthRepository instantiated");
            this.fileBackupMap = new Map();
            this.heartbeatCount = 0;
            this.inRecovery = false;
        }

        // Initialize object
        return HealthRepository.instance
    }

    //heartbeat
    getHeartbeatCounter() {
        return this.heartbeatCount;
    }
    
    incrementHeartbeatCounter() {
        this.heartbeatCount++;
    }

    resetHeartbeatCounter(){
        this.heartbeatCount = 0;
    }

    isInRecovery() {
        return this.inRecovery;
    }

    setInRecovery(inRecovery) {
        this.inRecovery = inRecovery;
    }

    // Files
    getFileBackupList() {
        const iter = this.fileBackupMap.values();
        const list = [];
        for (const {id, filename, filesize, pares} of iter) {
            list.push({id, filename, filesize, pares});
        }
        return list;
    }

    storeFileBackup(file, pares) {
        this.fileBackupMap.set(file.id, {
            ...file,
            pares
        });
    }

    getFileMapElement(fileId) {
        return this.fileBackupMap.get(fileId);
    }

    addPar(fileId, par) {
        this.fileBackupMap.get(fileId).pares.push(par);
    }

    resetFileBackup() {
        this.fileBackupMap.clear();
    }

    setFileBackupList(fileList) {
        this.fileBackupMap = new Map();
        for (const { id, filename, filesize, pares } of fileList) {
            this.fileBackupMap.set(id, {id, filename, filesize, pares});
        }
    }
}

const instance = new HealthRepository();

module.exports = instance;