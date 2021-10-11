const udp = require('dgram');
const { mainRouter } = require('./routes');

let server;

const startServer = (port = process.env.PORT) => {
    // creating a udp server
    server = udp.createSocket('udp4');

    // emits when any error occurs
    server.on('error', function (error) {
        console.log('Error: ' + error);
        server.close();
    });

    // emits on new datagram msg
    server.on('message', function (msg, info) {
        console.log('Data received from client : ' + msg.toString());
        console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
        try {
            const { route, body } = JSON.parse(msg.toString());
            console.log(route, body);
            mainRouter(route, body, info);
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
        console.log('Server is listening at port' + port);
        console.log('Server ip :' + ipaddr);
        console.log('Server is IP4/IP6 : ' + family);
    });

    //emits after the socket is closed using socket.close();
    server.on('close', function () {
        console.log('Socket is closed');
    });

    server.bind(port);
}
function serverSend(msg, address, port) {
    server.send(msg, port, address, function (error) {
        if (error) {
            console.error();
        } else {
            console.debug('Data sent');
        }
    });
}

module.exports = { startServer, serverSend }
