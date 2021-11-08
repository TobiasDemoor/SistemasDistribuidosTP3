const udp = require('dgram');
const { mainRouter } = require('./routes');

let server;

const startSocket = (port) => {
    // creating a udp server
    server = udp.createSocket('udp4');

    // emits when any error occurs
    server.on('error', function (error) {
        console.log('Error: ' + error);
        server.close();
    });

    // emits on new datagram msg
    server.on('message', async function (msg, info) {
        console.log('Data received from client : ' + msg.toString());
        console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
        try {
            const data = JSON.parse(msg.toString());
            const res = await mainRouter(data.route, data, info);
            if (res) {
                const {msg, ip, port} = res;
                socketSend(msg, ip, port);
            }
        } catch (e) {
            console.error(e)
        }
    });

    //emits when socket is ready and listening for datagram msgs
    server.on('listening', function () {
        var address = server.address();
        var port = address.port;
        var family = address.family;
        var ipaddr = address.address;
        console.log('Server is listening at port ' + port);
        console.log('Server ip: ' + ipaddr);
        console.log('Server is IP4/IP6: ' + family);
    });

    //emits after the socket is closed using socket.close();
    server.on('close', function () {
        console.log('Socket is closed');
    });

    server.bind(port);
}

function socketSend(msg, address, port) {
    const data = JSON.stringify(msg);
    console.log(`Sending data to client ${address}:${port}, data = ${data}`);
    server.send(data, port, address, function (error) {
        if (error) {
            console.error();
        } else {
            console.debug('Data sent');
        }
    });
}

module.exports = { startSocket, socketSend }
