const config = require('config');
const dgram = require('dgram');
const net = require('net');
const fs = require('fs');
const uuid = require('uuid');
const readline = require("readline");

const ip = config.get('ip');
const { port: udpPort } = config.get('udp');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function interface() {
    rl.question("Ingrese la ruta del archivo .torrente: ", (filename) => {
        fs.readFile(filename, (err, data) => {
            if (!err) {
                const { hash, trackerIP, trackerPort } = JSON.parse(data.toString());

                const messageId = uuid.v1();
                const client = dgram.createSocket('udp4');

                client.on('message', msg => {
                    const data = JSON.parse(msg.toString());
                    if (data.messageId === messageId) {
                        const { filename, filesize, pares } = data.body;
                        const { parIP, parPort } = pares[Math.floor(Math.random() * pares.length)];

                        const socket = net.connect(parPort, parIP, () => {
                            const writeStream = fs.createWriteStream(`./downloads/${filesize}-${filename}`);
                            socket.on('end', () => socket.end());
                            socket.pipe(writeStream);
                            socket.write(JSON.stringify({
                                type: 'GET FILE', 
                                hash
                            }));
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
            } else {
                console.log("Ese no es un archivo valido >:( ")
            }
            interface();
        });
    });
}

setTimeout(interface, 100);
