const healthRepository = require('../healthRepository');
const { sleep } = require('../helpers/sleep');
const repository = require('../repository');
const { storeFile } = require('./fileService');

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
    const { socketSend } = require('../server');
    const { nextIP, nextPort } = repository.getDHT();

    socketSend({ route: '/health/filebackup', file, pares }, nextIP, nextPort);
}

const sendFileParBackup = async (fileId, data) => {
    const { socketSend } = require('../server');
    const { nextIP, nextPort } = repository.getDHT();

    socketSend({route: '/health/fileparbackup', fileId, data}, nextIP, nextPort);
}

const startNodeMissing = (backIP, backPort) => {
    const { socketSend } = require('../server');
    const { ip, port, nextIP, nextPort } = repository.getDHT();
    const msg = {
        route: '/health/nodeMissing',
        missing: {
            ip: backIP,
            port: backPort
        },
        backup: {
            ip, port
        }
    }
    socketSend(msg, nextIP, nextPort);
}

const nodeMissing = (data) => {
    let msg = { ...data };
    const { ip, port, nextIP, nextPort } = repository.getDHT();
    if (data.missing.ip === nextIP && data.missing.port === nextPort) {
        console.log("Gap found in list");

        repository.setDHTNext(data.backup.ip, data.backup.port);
        msg = {
            route: "/health/setDHTBack",
            new: {
                ip, port,
                fileList: repository.getFileListWithPares()
            }
        };
        return {msg, ip: data.backup.ip, port: data.backup.port};
    } else {
        return {msg, nextIP, nextPort};
    }
}

const setDHTBack = (data) => {
    const { ip, port, fileList } = data.new;
    repository.setDHTBack(ip, port);
    healthRepository.setFileBackupList(fileList);
    return false; // TODO: return confirmation ?
}

const setDHTNext = (data) => {
    const { ip, port } = data.new;
    repository.setDHTNext(ip, port);
    return false; // TODO: return confirmation ?
}

const startRecovery = async () => {
    healthRepository.setInRecovery(true);

    let { ip, port, backIP, backPort } = repository.getDHT();
    // get file list before overwrite
    const orphanFileList = healthRepository.getFileBackupList();
    repository.setDHTBack(); // set DHT back to undefined
    startNodeMissing(backIP, backPort);

    // espero a que complete la recuperacion
    backIP = repository.getDHT().backIP;
    while (backIP === undefined) {
        console.log("Waiting for nodeMissing to complete");
        await sleep(50);
        backIP = repository.getDHT().backIP;
    }

    // repartir archivos pendientes de backup
    for (const file of orphanFileList) {
        storeFile({
            route: `/file/${file.id}/store`,
            originIP: ip,
            originPort: port,
            body: file
        });
    }

    healthRepository.setInRecovery(false);
    console.log("Recovery completed!");
}
    
module.exports = {
    recieveHeartbeat,
    storeFileBackup,
    storeFileParBackup,
    sendBackup,
    sendFileParBackup,
    nodeMissing,
    setDHTBack,
    setDHTNext,
    startRecovery
}