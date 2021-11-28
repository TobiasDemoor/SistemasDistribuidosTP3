const fs = require('fs');
const repository = require('./Repository');
const { createServer } = require('net');


const startServer = (ip, tcpPort) => {
    const server = createServer((socket) => {
        socket.on('data', (data) => {
            try {
                const req = JSON.parse(data.toString());
                console.debug(req);
                if (req.type === 'GET FILE') {
                    const readStream = fs.createReadStream(repository.getFilePath(req.hash));
                    readStream.on('data', data => socket.write(data));
                    readStream.on('end', () => socket.end());
                }
            } catch (e) {
                console.log(e, data.toString());
                socket.end()
            }
        });
    });

    server.listen(tcpPort, () => {
        console.log(`Server listening on port ${tcpPort}`);
    });
}

module.exports = { startServer };