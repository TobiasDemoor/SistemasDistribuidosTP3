const udp = require('dgram');

// creating a client socket
const client = udp.createSocket('udp4');

client.on('message', function (msg, info) {
    console.log('Data received from server : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
});
client.bind(2500);

//buffer msg
const dataStore = JSON.stringify({
    messageId: '123',
    route: "/file/aaaaaa/store",
    originIP: "127.0.0.1",
    originPort: 2500,
    body: {
        id: "aaaaaa",
        filename: "filename",
        filesize: 1,
        parIP: "127.0.0.1",
        parPort: 2500
    }
})

client.send(dataStore, 2000, 'localhost', function (error) {
    if (error) {
        client.close();
    } else {
        console.debug('Data sent');
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

sleep(500).then(() => {
    //buffer msg
    const dataCount = JSON.stringify({
        messageId: '1234',
        route: "/file/aaaaaa",
        originIP: "127.0.0.1",
        originPort: 2500
    })

    client.send(dataCount, 2000, 'localhost', function (error) {
        if (error) {
            client.close();
        } else {
            console.debug('Data sent');
        }
    });

    setTimeout(() => client.close(), 1000);
})
