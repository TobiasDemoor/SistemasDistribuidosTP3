const healthRepository = require('../healthRepository');

const recieveHeartbeat = () => {
    healthRepository.resetHeartbeatCounter();
    return false;
}

const storeFileBackup = (file) => {
    healthRepository.storeFileBackup(file);
}

const nodeMissing = () => {
    healthRepository.setInRecovery(true);
    // TODO: mucho
}
    
module.exports = {
    recieveHeartbeat,
    storeFileBackup,
    nodeMissing
}