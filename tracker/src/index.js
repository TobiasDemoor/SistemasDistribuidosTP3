const config = require('config');
const uuid = require('uuid');
const { startSocket } = require('./server');
const repository = require('./repository');

const id = uuid.v4()
let port, backIP, backPort, nextIP, nextPort;
if (process.argv.length != 7) {
    const socket = config.get('socket');
    port = socket.port;
    backIP = socket.backIP;
    backPort = socket.backPort;
    nextIP = socket.nextIP;
    nextPort = socket.nextPort;
} else {
    port = parseInt(process.argv[2]);
    backIP = process.argv[3];
    backPort = parseInt(process.argv[4]);
    nextIP = process.argv[5];
    nextPort = parseInt(process.argv[6]);
}

repository.setDHT({ id, backIP, backPort, nextIP, nextPort })
startSocket(port);