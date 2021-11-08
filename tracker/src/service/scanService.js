const { messageIdLifespan } = require('config');
const repository = require('../repository');

const startFileScan = (data) => {
    repository.addMessageId("fileScan", data.messageId, messageIdLifespan);

    return {
        ...data,
        body: {
            files: []
        }
    };
}

const fileScan = (data) => {
    let msg;
    if (data.body === undefined) {
        msg = startFileScan(data);
    } else {
        msg = { ...data };
        if (data.messageId === repository.getMessageId("fileScan")) {
            repository.deleteMessageId("fileScan");
            return {msg, ip: msg.originIP, port: msg.originPort};
        }
    }
    msg.body.files = [...msg.body.files, ...repository.getFileList()];
    const { nextIP, nextPort } = repository.getDHT();
    return { msg, ip: nextIP, port: nextPort };

}

module.exports = { fileScan };