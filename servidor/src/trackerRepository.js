const dgram = require('dgram');
const uuid = require('uuid');
const config = require('config');

const { ip: trackerIp, port: trackerPort } = config.get('tracker');
const { ip, port } = config.get('udp');
const { validFor } = config.get('cache');

const socket = dgram.createSocket('udp4');
socket.bind(port);

const buffer = new Map();
const scanCache = {
    data: null,
    expiration: 0
}

socket.on('message', function (msg, info) {
    console.log('Data received from tracker : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
    const data = JSON.parse(msg.toString());
    buffer.set(data.messageId, data);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getValue = async (key) => {
    while (!buffer.has(key)) {
        await sleep(50);
    }
    const data = buffer.get(key);
    buffer.delete(key);
    return data;
};

const scanFiles = async () => {
    if (scanCache.expiration > Date.now()) {
        return scanCache.data;
    }
    const messageId = uuid.v1()
    socketSend({
        messageId,
        route: "/scan",
        originIP: ip,
        originPort: port,
    });
    const { body: { files: data } } = await getValue(messageId);
    scanCache.data = data;
    scanCache.expiration = Date.now() + validFor;
    return data;
}

const storeFile = async (file) => {
    const messageId = uuid.v1()
    socketSend({
        messageId,
        route: `/file/${file.id}/store`,
        originIp: ip,
        originPort: port,
        body: {
            ...file
        }
    })
    const { body: data } = await getValue(messageId);
    scanCache.expiration = 0;
    return data;
}

const searchFile = async (fileId) => {
    const messageId = uuid.v1()
    socketSend({
        messageId,
        route: `/file/${fileId}`,
        originIp: ip,
        originPort: port
    })
    const { trackerIP, trackerPort } = (await getValue(messageId)).body
    const data = { 
        hash: fileId,
        trackerIP: trackerIP,
        trackerPort: trackerPort
    }
    return data;
}


const socketSend = (data) => {
    socket.send(JSON.stringify(data), trackerPort, trackerIp, function (error) {
        if (error) {
            socket.close();
        } else {
            console.debug('Data sent to tracker');
        }
    })
}

module.exports = {
    scanFiles,
    storeFile,
    searchFile
};
