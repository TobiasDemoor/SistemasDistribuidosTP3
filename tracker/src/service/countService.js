const repository = require('../repository');
const uuid = require('uuid');
const { messageIdLifespan } = require('config');

const getCurrentCount = () => {
    const { socketSend } = require('../server');
    socketSend(getCount({ route: "/count" }));
}

const startGetCount = (data) => {
    const messageId = uuid.v1();
    repository.addMessageId("getCount", messageId, messageIdLifespan);
    const msg = { ...data };
    msg.messageId = messageId;
    msg.body = {
        trackerCount: 1,
        fileCount: repository.getFileCount()
    }
    return msg;
}

const getCount = (data) => {
    let msg;
    if (data.messageId === undefined) {
        msg = startGetCount(data);
    } else if (data.messageId === repository.getMessageId("getCount")) {
        const { ip, port } = repository.getDHT();
        console.debug(`Count was received in node ${ip}:${port} count = ${data.body.trackerCount}`);
        repository.setTrackerCount(data.body.trackerCount);
        repository.deleteMessageId("getCount");
        return false;
    } else {
        let { trackerCount, fileCount } = data.body;
        trackerCount++;
        fileCount += repository.getFileCount();
        msg = { ...data };
        msg.body = {
            trackerCount,
            fileCount
        }
    }

    const { nextIP, nextPort } = repository.getDHT();
    return { msg, ip: nextIP, port: nextPort };
}

const startClearCount = (data) => {
    const messageId = uuid.v1();
    repository.addMessageId("clearCount", messageId, messageIdLifespan);
    const msg = { ...data };
    msg.messageId = messageId;
    return msg;
}

const clearCount = (data) => {
    let msg = { ...data };
    if (data.messageId === undefined) {
        msg = startClearCount(data);
    } else if (data.messageId === repository.getMessageId("clearCount")) {
        repository.deleteMessageId("clearCount");
        return false;
    }
    const { ip, port, nextIP, nextPort } = repository.getDHT();
    repository.clearCount();
    console.debug(`Count was cleared in node ${ip}:${port}`);

    return { msg, ip: nextIP, port: nextPort };
}

module.exports = {
    getCurrentCount,
    getCount,
    clearCount
};
