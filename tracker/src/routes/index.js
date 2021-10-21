// const {socketSend} = require('../server');

function parseRoute(route) {
    console.debug(route);
    const i = route.indexOf("/", 1);
    const param = route.slice(0, i);
    const rest = route.slice(i);
    console.debug(param, rest);
    return {param, rest}
}

const mainRouter = async (route, body, info) => {
    console.log(param, rest);

    // socketSend(JSON.stringify({ route, body }), info.address, info.port);
}

module.exports = { mainRouter }