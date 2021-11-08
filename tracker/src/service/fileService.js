const { messageIdLifespan } = require('config');
const repository = require('../repository');
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
    const divi = Math.floor(count / 2);
    if (x > divi) {
        msg.clockwise = true;
        msg.x = x - divi
    } else {
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
        const { id, filename, filesize, parIP, parPort } = msg.body;
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

const fileSearch = (fileId, data) => {
    const file = repository.getFileMapElement(fileId);
    const dht = repository.getDHT();
    const msg = { ...data };

    if (data.messageId === repository.getMessageId("fileSearch")) {
        repository.deleteMessageId("fileSearch");
        return { msg, ip: msg.originIP, port: msg.originPort };
    } else {
        repository.addMessageId("fileSearch", data.messageId, messageIdLifespan);
    }

    if (file) {
        const { id, ip, port } = dht;
        msg.route += "/found"
        msg.body = {
            id, trackerIp: ip, trackerPort: port, pares: file.pares
        };
        // responder
        return { msg, ip: msg.originIP, port: msg.originPort };
    }

    return { msg, ip: dht.nextIP, port: dht.nextPort };
}

module.exports = { storeFile, fileSearch };
