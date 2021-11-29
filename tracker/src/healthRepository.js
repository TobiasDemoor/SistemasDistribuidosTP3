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
        for (const {id, filename, filesize} of iter) {
            list.push({id, filename, filesize});
        }
        return list;
    }

    storeFileBackup(file, pares) {
        console.log(file, pares);
        this.fileBackupMap.set(file.id, {
            ...file,
            pares
        });
    }

    resetFileBackup() {
        this.fileBackupMap.clear();
    }
}

const instance = new HealthRepository()

module.exports = instance;