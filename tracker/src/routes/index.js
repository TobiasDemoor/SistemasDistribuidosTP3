const {serverSend} = require('../server');

const mainRouter = async (route, body, info) => {
    console.log(route, body);
    serverSend(JSON.stringify({ route, body }), info.address, info.port);
}

module.exports = { mainRouter }