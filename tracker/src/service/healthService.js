const healthRepository = require('../healthRepository');
const { sleep } = require('../helpers/sleep');
const repository = require('../repository');

// endpoint services

const heartbeat = () => {
    healthRepository.resetHeartbeatCounter();
    return false;
}

const fileBackup = (data) => {
    const { file, pares } = data
    healthRepository.storeFileBackup(file, pares);
    const { ip, port } = repository.getDHT();
    console.debug(`File ${file.filename} backuped in ${ip}:${port}`);
    return false;
}

const fileParBackup = (data) => {
    const { fileId, parIP, parPort } = data;
    const file = healthRepository.getFileMapElement(fileId);
    if (file) {
        healthRepository.addPar(fileId, { parIP, parPort });
        const { ip, port } = repository.getDHT();
        console.debug(`File par ${file.filename} backuped in ${ip}:${port}`);
    }
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
    const msg = {
        route: "/health/setDHTBack",
        new: {
            ip, port, fileList: repository.getFileListWithPares()
        }
    };
    return { msg, ip: nextIP, port: nextPort };
}

const insertNode = (data) => {
    const { socketSend } = require('../server');
    const { clearCount } = require('./countService');
    const { ip: newIP, port: newPort } = data;
    const { ip, port, nextIP, nextPort } = repository.getDHT();

    socketSend({
        msg: {
            route: "/health/setDHTBack",
            new: {
                ip, port, fileList: repository.getFileListWithPares()
            }
        },
        ip: newIP,
        port: newPort
    });

    // set DHT next mocking nextIP:nextPort node
    socketSend({
        msg: {
            route: '/health/setDHTNext',
            new: {
                ip: nextIP,
                port: nextPort
            }
        },
        ip: newIP,
        port: newPort
    });

    socketSend(clearCount({
        route: '/count/clear'
    }));

    repository.setDHTNext(newIP, newPort);
}

const leave = async (data) => {
    const { socketSend } = require('../server');
    const { storeFile } = require('./fileService');
    const { clearCount } = require('./countService');

    healthRepository.setInRecovery(true);
    console.debug("Starting leave");

    const { backIP: newBackIP, backPort: newBackPort } = data;
    const { ip, port, backIP, backPort, nextIP, nextPort } = repository.getDHT();
    repository.setDHTBack(newBackIP, newBackPort);
    // get file list before overwrite
    const orphanFileList = healthRepository.getFileBackupList();
    console.debug("Orphan file count: ", orphanFileList.length);

    if (backIP !== nextIP || backPort !== nextPort) {
        socketSend({
            msg: {
                route: '/health/setDHTNext',
                new: {
                    ip, port
                }
            },
            ip: newBackIP,
            port: newBackPort
        });
        socketSend(clearCount({
            route: '/count/clear'
        }));
    } else { //unico nodo tracker en la red
        repository.clearCount();
        repository.setDHTBack(ip, port);
        repository.setDHTNext(ip, port);
    }



    // repartir archivos pendientes de backup
    for (const file of orphanFileList) {
        socketSend(await storeFile({
            route: `/file/${file.id}/store`,
            originIP: ip,
            originPort: port,
            body: file
        }));
    }

    healthRepository.setInRecovery(false);
    console.debug("Leave completed!");
}

// auxiliary services

const sendFileBackup = async (file, pares) => {
    const { socketSend } = require('../server');
    const { nextIP, nextPort } = repository.getDHT();

    socketSend({
        msg: { route: '/health/fileBackup', file, pares },
        ip: nextIP,
        port: nextPort
    });
}

const sendFileParBackup = async (fileId, data) => {
    const { socketSend } = require('../server');
    const { nextIP, nextPort } = repository.getDHT();

    socketSend({
        msg: { route: '/health/fileParBackup', fileId, data },
        ip: nextIP,
        port: nextPort
    });
}

const startNodeMissing = (backIP, backPort) => {
    const { socketSend } = require('../server');
    const { ip, port } = repository.getDHT();
    socketSend(nodeMissing({
        route: '/health/nodeMissing',
        missing: {
            ip: backIP,
            port: backPort
        },
        backup: {
            ip, port
        }
    }));
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
        socketSend(await storeFile({
            route: `/file/${file.id}/store`,
            originIP: ip,
            originPort: port,
            body: file
        }));
    }

    healthRepository.setInRecovery(false);
    console.log("Recovery completed!");
}

const insertIntoDHT = async (ip, port, backIP, backPort) => {
    const { socketSend } = require('../server');
    repository.setDHTNext();
    socketSend({
        msg: {
            route: '/health/insertNode',
            ip, port
        },
        ip: backIP,
        port: backPort
    });
}

const sendLeave = () => {
    const { ip, port, nextIP, nextPort, backIP, backPort } = repository.getDHT();
    console.log(`${ip}:${port} is leaving`);
    const msg = {
        route: '/health/leave',
        backIP,
        backPort
    }
    return { msg, ip: nextIP, port: nextPort };
}


module.exports = {
    heartbeat,
    fileBackup,
    fileParBackup,
    nodeMissing,
    setDHTBack,
    setDHTNext,
    insertNode,
    leave,
    sendFileBackup,
    sendFileParBackup,
    startRecovery,
    insertIntoDHT,
    sendLeave,
}
