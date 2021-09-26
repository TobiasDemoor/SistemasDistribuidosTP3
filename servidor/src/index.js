const config = require('config');
const { startServer } = require('./start');

startServer(config.express.port);