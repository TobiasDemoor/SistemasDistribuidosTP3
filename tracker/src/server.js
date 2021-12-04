const udp = require('dgram');
const { mainRouter } = require('./routes');
const { sendLeave } = require('./service/healthService');

let server;

const startSocket = (port) => {
    return new Promise((resolve) => {
        // creating a udp server
        server = udp.createSocket('udp4');

        // emits when any error occurs
        server.on('error', function (error) {
            console.error(error);
            server.close();
        });

        // emits on new datagram msg
        server.on('message', async function (msg, info) {
            // console.debug('Data received from client : ' + msg.toString());
            // console.debug('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
            try {
                const data = JSON.parse(msg.toString());
                const res = await mainRouter(data.route, data, info);
                if (res) {
                    const { msg, ip, port } = res;
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

        setupCloseOnExit(server);

        server.bind(port, () => resolve());
    });
}


function setupCloseOnExit(server) {
    // thank you stack overflow
    // https://stackoverflow.com/a/14032965/971592
    // catches ctrl+c event
    process.on('SIGINT', () => {
        // avoid leave
        // server.close();
        // return ;

        // send leave
        const { msg, ip, port } = sendLeave();
        socketSend(msg, ip, port).
        then(() => {
            server.close(() => {
                console.info('Server has been shut down successfuly')
            });
        });
    })
}

function socketSend(msg, ip, port, echo = true) {
    return new Promise((resolve) => {
        const data = JSON.stringify(msg);
        if (echo) {
            console.debug(`Sending data to client ${ip}:${port} to route ${msg.route}`);
        }
        server.send(data, port, ip, function (error) {
            if (error) {
                console.error(error);
            } else {
                resolve();
            }
        })
    });
}

module.exports = { startSocket, socketSend }
