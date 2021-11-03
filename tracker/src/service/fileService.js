// const {socketSend} = require('./server');
const repository = require('../repository');
const uuid = require('uuid');
const { messageIdLifespan } = require('config');
const { getCurrentCount } = require('./countService');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const startStoreFile = async (data) => {
    let count = repository.getTrackerCount();
    if (count === undefined) {
        getCurrentCount();
        while (count === undefined) {
            console.log("Waiting for count");
            await sleep(50);
            count = repository.getTrackerCount();
        }
    }
    const msg = { ...data };
    const x = Math.floor(Math.random() * count);
    console.log(x);
    const divi = Math.floor(count / 2);
    if (x > divi) {
        // der
        msg.clockwise = true;
        msg.x = x - divi
    } else {
        // izq
        msg.clockwise = false;
        msg.x = x
    }

    return msg;
}

const storeFile = async (data) => {
    let msg = { ...data };

    if (msg.clockwise === undefined || msg.x === undefined) {
        msg = await startStoreFile(data);
    }

    if (msg.x === 0) {
        const { id, filename, filesize, parIP, parPort } = msg;
        repository.storeFile({ id, filename, filesize }, { parIP, parPort });
        return { msg, ip: msg.originIP, port: msg.originPort };
    }

    msg.x--;
    const dht = repository.getDHT();
    let ip, port;
    if (msg.clockwise) {
        ip = dht.nextIP;
        port = dht.nextPort;
    } else {
        ip = dht.backIP;
        port = dht.backPort;
    }

    return { msg, ip, port };
}

const startFileScan = (data) => {
    const id = uuid.v1();
    repository.addMessageId("FileScan", id, messageIdLifespan);
    const msg = { ...data };
    msg.messageId = id;
    msg.body = {
        trackerCount: 1,
        fileCount: repository.getFileList()
    }
    return msg;
}

const fileScan = (data) => {
    let msg;
    if (data.messageId === undefined) {
        msg = startFileScan(data);
    } else {

        if (data.MessageId === repository.getMessageId("FileScan")) {
            //enviar data?
        } else {
            let { fileList } = data.body;
            fileList.append(repository);
            msg = { ...data };
            msg.body = {
                fileList
            }
        }
    }
    //pasar filescan al siguiente nodo
    //return msg?
    const { nextIP, nextPort } = repository.getDHT();
    return { msg, ip: nextIP, port: nextPort };

}

// const fileSearch = (data) => {
// }

// const fileFound = (data) => {
// }

module.exports = { storeFile, fileScan };
