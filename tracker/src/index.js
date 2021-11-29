const uuid = require('uuid');
const config = require('config');
const repository = require('./repository');
const { startSocket } = require('./server');
const { startHeartbeatDaemon } = require('./heartbeatDaemon');

const id = uuid.v4()
let ip, port, backIP, backPort, nextIP, nextPort;
if (process.argv.length != 8) {
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
    nextIP = process.argv[6];
    nextPort = parseInt(process.argv[7]);
}

repository.setDHT({ id, ip, port, backIP, backPort, nextIP, nextPort });
startSocket(port);
setTimeout(() => startHeartbeatDaemon(), 1000);