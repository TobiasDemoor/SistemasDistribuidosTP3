const udp = require('dgram');

// creating a client socket
const client = udp.createSocket('udp4');

client.on('message', function (msg, info) {
    console.log('Data received from server : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
});


//buffer msg
const data = JSON.stringify({
    route: "/scan/pepe/1/2",
    body: null
})

//sending msg
client.send(data, 3000, 'localhost', function (error) {
    if (error) {
        client.close();
    } else {
        console.debug('Data sent');
    }
});

console.log(process.argv[2])