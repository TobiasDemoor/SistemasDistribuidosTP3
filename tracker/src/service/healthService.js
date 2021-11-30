const healthRepository = require('../healthRepository');
const repository = require('../repository');

const recieveHeartbeat = () => {
    healthRepository.resetHeartbeatCounter();
    return false;
}

const storeFileBackup = (data) => {
    const { file, pares } = data
    healthRepository.storeFileBackup(file, pares);
    console.log("storefilebackup", data)
    return false;
}

const sendBackup = async (file, pares) => {
    console.log("Health Service sendBackup", file, pares);
    const { backIP, backPort } = repository.getDHT();
    const { socketSend } = require('../server');
    socketSend({ route: '/health/storefilebackup', file, pares }, backIP, backPort);
}

const nodeMissing = () => {
    healthRepository.setInRecovery(true);
    // TODO: mucho
}
    
module.exports = {
    recieveHeartbeat,
    storeFileBackup,
    sendBackup,
    nodeMissing
}