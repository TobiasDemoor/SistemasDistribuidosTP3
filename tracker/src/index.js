const uuid = require('uuid');
const config = require('config');
const repository = require('./repository');
const { startSocket } = require('./server');
const { insertIntoDHT } = require('./service/healthService');

const id = uuid.v4()
let ip, port, backIP, backPort, nextIP, nextPort;
if (process.argv.length < 6) {
    // use config file
    const socket = config.get('socket');
    ip = socket.ip;
    port = socket.port;
    backIP = socket.backIP;
    backPort = socket.backPort;
    nextIP = socket.nextIP;
    nextPort = socket.nextPort;
} else {
    ip = process.argv[2];
    port = parseInt(process.argv[3]);
    backIP = process.argv[4];
    backPort = parseInt(process.argv[5]);
    if (process.argv.length == 8) {
        nextIP = process.argv[6];
        nextPort = parseInt(process.argv[7]);
    }
}

repository.setDHT({ id, ip, port, backIP, backPort, nextIP, nextPort });
startSocket(port).then(() => {
    if (!nextIP || !nextPort) {
        // insert into existing DHT
        insertIntoDHT(ip, port, backIP, backPort);
    }
});
