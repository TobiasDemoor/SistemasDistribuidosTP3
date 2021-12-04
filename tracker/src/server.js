const udp = require('dgram');
const { startHeartbeatDaemon } = require('./heartbeatDaemon');
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

        const daemon = startHeartbeatDaemon();
        setupCloseOnExit(server, daemon);

        server.bind(port, () => resolve());
    });
}


function setupCloseOnExit(server, daemon) {
    // thank you stack overflow
    // https://stackoverflow.com/a/14032965/971592
    function exitHandler() {
        // clear daemon interval
        clearInterval(daemon);
        
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
        }).catch(e => {
            console.error(e);
            server.close(() => {
                console.info('Server has been shut down unsuccessfuly')
            });
        });
    }

    // do something when app is closing
    // process.on('exit', exitHandler)

    // catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }))

    // // catches "kill pid" (for example: nodemon restart)
    // process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
    // process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))

    // catches uncaught exceptions
    // process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
}

function socketSend(msg, ip, port, echo = true) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(msg);
        if (echo) {
            console.debug(`Sending data to client ${ip}:${port} to route ${msg.route}`);
        }
        server.send(data, port, ip, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        })
    });
}

module.exports = { startSocket, socketSend }
