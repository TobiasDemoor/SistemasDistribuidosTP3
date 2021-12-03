const healthRepository = require('../healthRepository');
const { sleep } = require('../helpers/sleep');
const repository = require('../repository');

const recieveHeartbeat = () => {
    healthRepository.resetHeartbeatCounter();
    return false;
}

const storeFileBackup = (data) => {
    const { file, pares } = data
    healthRepository.storeFileBackup(file, pares);
    const { ip, port } = repository.getDHT();
    console.debug(`File ${file.filename} backuped in ${ip}:${port}`);
    return false;
}

const storeFileParBackup = (data) => {
    const { fileId, parIP, parPort } = data;
    const file = healthRepository.getFileMapElement(fileId);
    if (file) {
        healthRepository.addPar(fileId, { parIP, parPort });
        const { ip, port } = repository.getDHT();
        console.debug(`File par ${file.filename} backuped in ${ip}:${port}`);
    }
}
//Le paso la lista de archivos al nodo siguiente para tener backup 
const sendBackup = async (file, pares) => {
    const { socketSend } = require('../server');
    const { nextIP, nextPort } = repository.getDHT();

    socketSend({ route: '/health/filebackup', file, pares }, nextIP, nextPort);
}

//Agrego al tracker de backup que ahora existe un nuevo par que almacena el archivo
const sendFileParBackup = async (fileId, data) => {
    const { socketSend } = require('../server');
    const { nextIP, nextPort } = repository.getDHT();

    socketSend({ route: '/health/fileparbackup', fileId, data }, nextIP, nextPort);
}

const setDHTBack = (data) => {
    const { ip, port, fileList } = data.new;
    repository.setDHTBack(ip, port);
    healthRepository.setFileBackupList(fileList);
    return false; // TODO: return confirmation ?
}

const setDHTNext = (data) => {
    const { ip: nextIP, port: nextPort } = data.new;
    repository.setDHTNext(nextIP, nextPort);
    const { ip, port } = repository.getDHT();
    return sendSetDHTBack(nextIP, nextPort, ip, port, repository.getFileListWithPares());
}

const sendSetDHTBack = (nextIP, nextPort, ip, port, fileList) => {
    const msg = {
        route: "/health/setDHTBack",
        new: {
            ip, port, fileList
        }
    };
    return { msg, ip: nextIP, port: nextPort };
}

const startNodeMissing = (backIP, backPort) => {
    const { socketSend } = require('../server');
    const { ip, port, nextIP, nextPort } = repository.getDHT();
    repository.clearCount();
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
    repository.clearCount();
    if (data.missing.ip === nextIP && data.missing.port === nextPort) {
        console.debug("Gap found in list");
        const { ip: newIP, port: newPort } = data.backup;
        repository.setDHTNext(newIP, newPort);
        const msg = {
            route: "/health/setDHTBack",
            new: {
                ip, port, fileList: repository.getFileListWithPares()
            }
        };
        return { msg, ip: newIP, port: newPort };
    } else {
        console.debug(`Continuing node missing with ${nextIP}:${nextPort}`);
        return { msg, ip: nextIP, port: nextPort };
    }
}

const startRecovery = async () => {
    const { socketSend } = require('../server');
    const { storeFile } = require('./fileService');

    healthRepository.setInRecovery(true);
    console.debug("Starting recovery");

    let { ip, port, backIP, backPort } = repository.getDHT();
    // get file list before overwrite
    const orphanFileList = healthRepository.getFileBackupList();
    console.log("Orphan file count: ", orphanFileList.length);
    repository.setDHTBack(); // set DHT back to undefined
    startNodeMissing(backIP, backPort);

    // espero a que complete la recuperacion
    backIP = repository.getDHT().backIP;
    while (backIP === undefined) {
        console.debug("Waiting for nodeMissing to complete");
        await sleep(50);
        backIP = repository.getDHT().backIP;
    }

    // repartir archivos pendientes de backup
    for (const file of orphanFileList) {
        const { msg, ip: msgIP, port: msgPort } = await storeFile({
            route: `/file/${file.id}/store`,
            originIP: ip,
            originPort: port,
            body: file
        });
        socketSend(msg, msgIP, msgPort);
    }

    healthRepository.setInRecovery(false);
    console.log("Recovery completed!");
}

const sendLeave = () => {
    const { ip, port, nextIP, nextPort, backIP, backPort } = repository.getDHT();
    console.log(`${ip}:${port} is leaving`);
    const msg = {
        route: '/health/leave',
        backIP, backPort
    }
    return { msg, ip: nextIP, port: nextPort };
}

const leave = async (data) => {
    const { socketSend } = require('../server');
    const { storeFile } = require('./fileService');
    const { clearCount } = require('./countService');

    healthRepository.setInRecovery(true);
    console.debug("Starting leave");

    const { backIP, backPort } = data;
    const { ip, port, nextIP, nextPort } = repository.getDHT();
    repository.setDHTBack(backIP, backPort);
    // get file list before overwrite
    const orphanFileList = healthRepository.getFileBackupList();
    console.debug("Orphan file count: ", orphanFileList.length);

    socketSend({
        route: '/health/setDHTNext',
        new: {
            ip, port
        }
    }, backIP, backPort);

    const { msg } = clearCount({
        route: '/count/clear'
    });
    socketSend(msg, nextIP, nextPort);

    // repartir archivos pendientes de backup
    for (const file of orphanFileList) {
        const { msg, ip: msgIP, port: msgPort } = await storeFile({
            route: `/file/${file.id}/store`,
            originIP: ip,
            originPort: port,
            body: file
        });
        socketSend(msg, msgIP, msgPort);
    }

    healthRepository.setInRecovery(false);
    console.debug("Leave completed!");
}

const insertNode = (data) => {
    const { socketSend } = require('../server');
    const { clearCount } = require('./countService');
    const { ip: newIP, port: newPort } = data;
    const { ip, port, nextIP, nextPort } = repository.getDHT();

    socketSend({
        route: "/health/setDHTBack",
        new: {
            ip, port, fileList: repository.getFileListWithPares()
        }
    }, newIP, newPort);

    // set DHT next mocking nextIP:nextPort node
    socketSend({
        route: '/health/setDHTNext',
        new: {
            ip: nextIP,
            port: nextPort
        }
    }, newIP, newPort);

    const { msg } = clearCount({
        route: '/count/clear'
    });
    socketSend(msg, nextIP, nextPort);

    repository.setDHTNext(newIP, newPort);
}

const insertIntoDHT = async (ip, port, backIP, backPort) => {
    const { socketSend } = require('../server');
    repository.setDHTNext();
    socketSend({
        route: '/health/insertNode',
        ip, port
    }, backIP, backPort);
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
    startRecovery,
    insertNode,
    insertIntoDHT,
    sendLeave,
    leave
}
