const config = require('config');
const {startServer} = require('./server');

let port = config.express.port;
if (process.argv.length > 2) {
    port += parseInt(process.argv[2])
}

startServer(port)