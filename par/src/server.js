const fs = require('fs');
const config = require('config');
const { createServer } = require('net');
const { port } = config.get('tcp');

const server = createServer((socket) => {
    socket.on('data', (data) => {
        try {
            const req = JSON.parse(data.toString());
            console.log(req);
            if (req.type === 'GET FILE') {
                const localFilename = 'C:/Users/tobia/Documents/SistemasDistribuidosTP3/par/src/client.js';
                const readStream = fs.createReadStream(localFilename);
                readStream.on('data', data => socket.write(data));
                readStream.on('end', () => socket.end());
            }
        } catch (e) {
            console.log(e, data.toString());
            socket.end()
        }
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
