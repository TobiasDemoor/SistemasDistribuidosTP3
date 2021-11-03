const repository = require('../repository');
const uuid = require('uuid');
const { messageIdLifespan } = require('config');

function getCurrentCount() {
    const { msg, ip, port } = getCount({ route: "/count" });
    const { socketSend } = require('../server');
    socketSend(msg, ip, port);
}

const startGetCount = (data) => {
    const id = uuid.v1();
    repository.addMessageId("getCount", id, messageIdLifespan);
    const msg = { ...data };
    msg.messageId = id;
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
        console.log("Count", data);
        const { trackerCount } = data.body;
        repository.setTrackerCount(trackerCount);
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

module.exports = { getCurrentCount, getCount };