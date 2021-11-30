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

const storeFileParBackup = (data) => {
    const { fileId, parIP, parPort } = data;
    const file = healthRepository.getFileMapElement(fileId);
    if (file) {
        healthRepository.addPar(fileId, { parIP, parPort });
        console.log("par backup saved :)", data);
    }
}

const sendBackup = async (file, pares) => {
    console.log("Health Service sendBackup", file, pares);
    const { nextIP, nextPort } = repository.getDHT();
    const { socketSend } = require('../server');
    socketSend({ route: '/health/filebackup', file, pares }, nextIP, nextPort);
}

const sendFileParBackup = async (fileId, data) => {
    console.log("sendFileParBackup", fileId, data);
    const { nextIP, nextPort } = repository.getDHT();
    const { socketSend } = require('../server');
    socketSend({route: '/health/fileparbackup', fileId, data}, nextIP, nextPort);
}

const nodeMissing = () => {
    healthRepository.setInRecovery(true);
    // TODO: mucho
}
    
module.exports = {
    recieveHeartbeat,
    storeFileBackup,
    storeFileParBackup,
    sendBackup,
    sendFileParBackup,
    nodeMissing
}