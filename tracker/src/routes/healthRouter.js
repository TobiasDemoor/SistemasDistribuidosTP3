const { recieveHeartbeat, storeFileBackup } = require("../service/healthService");
const parseRoute = require("./parseRoute");

const healthRouter = (route, data) => {
    const { param } = parseRoute(route);
    
    switch (param) {
        case "/heartbeat":
            return recieveHeartbeat();
        case "/storefilebackup":
            return storeFileBackup(data);
        default:
            throw new Error("Invalid route");
    }
}

module.exports = { healthRouter };