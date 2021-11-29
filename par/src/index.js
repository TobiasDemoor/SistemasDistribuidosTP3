const config = require('config');
const repository = require('./repository');

const { startServer } = require('./server');
const { startClient } = require('./client')

let downloads, ip, tcpPort, udpPort;
if (process.argv.length == 6) {
    ip = process.argv[2];
    tcpPort = parseInt(process.argv[3]);
    udpPort = parseInt(process.argv[4]);
    downloads = config.get('replicaPaths')[parseInt(process.argv[5])];
} else {
    ip = config.get('ip');
    tcpPort = config.get('tcpPort');
    udpPort = config.get('udpPort');
    downloads = config.get('downloads');
}

repository.setInit(downloads, ip, tcpPort, udpPort);

startServer(ip, tcpPort);
startClient(ip, udpPort);