const path = require('path');
const dgram = require('dgram');
const net = require('net');
const fs = require('fs');
const uuid = require('uuid');
const readline = require("readline");

const repository = require('./repository');


const registerParToTracker = (trackerIP, trackerPort, hash, filename, filesize, ip, udpPort, callback) => {
    const client = dgram.createSocket('udp4');
    const messageId = uuid.v1();

    client.bind(udpPort);

    client.on('message', msg => {
        const data = JSON.parse(msg.toString());
        console.debug(data);
        if (data.messageId === messageId) {
            callback();
        }
    })

    client.send(JSON.stringify({
        messageId,
        route: `/file/${hash}/addPar`,
        filename,
        filesize,
        parIP: ip,
        parPort: udpPort
    }), trackerPort, trackerIP);
}


const downloadFile = (filename, filesize, pares, downloads, hash, callback) => {
    const { parIP, parPort } = pares[Math.floor(Math.random() * pares.length)];

    const socket = net.connect(parPort, parIP, () => {
        const writeStream = fs.createWriteStream(path.resolve(downloads + `/${filesize}-${filename}`));
        socket.on('end', () => {
            socket.end();
            callback();
        });
        socket.pipe(writeStream);
        socket.write(JSON.stringify({
            type: 'GET FILE',
            hash
        }));
    });
}

const downloadFileFromTorrente = (torrentePath, callback) => {
    const downloads = repository.getDownloadsPath();
    const ip = repository.getIP();
    const udpPort = repository.getUDPPort();
    fs.readFile(torrentePath, (err, data) => {
        if (err) {
            console.log("Ese no es un archivo valido >:( ")
            return;
        }
        const { hash, trackerIP, trackerPort } = JSON.parse(data.toString());
        const client = dgram.createSocket('udp4');
        const messageId = uuid.v1();

        client.bind(udpPort);
        client.on('message', msg => {
            const data = JSON.parse(msg.toString());
            console.debug(data);
            if (data.messageId === messageId) {
                const { filename, filesize, pares } = data.body;
                downloadFile(filename, filesize, pares, downloads, hash, () => {
                    client.close(() =>
                        registerParToTracker(trackerIP, trackerPort, hash, filename, filesize, ip, udpPort, callback)
                    );
                });
            }
        });

        client.send(JSON.stringify({
            messageId,
            route: `/file/${hash}`,
            originIP: ip,
            originPort: udpPort,
            body: {}
        }), trackerPort, trackerIP);
    });
}

const startClient = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    const interface = () => {
        rl.question("Ingrese la ruta del archivo .torrente: ", (filepath) => {
            downloadFileFromTorrente(filepath, interface);
        });
    }
    interface();
}

module.exports = { startClient };

