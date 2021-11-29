const { recieveHeartbeat } = require("../service/healthService");
const parseRoute = require("./parseRoute");

const healthRouter = (route) => {
    const { param } = parseRoute(route);
    
    switch (param) {
        case "/heartbeat":
            return recieveHeartbeat();
        default:
            throw new Error("Invalid route");
    }
}

module.exports = { healthRouter };