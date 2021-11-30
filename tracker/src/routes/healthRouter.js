const { recieveHeartbeat, storeFileBackup, storeFileParBackup } = require("../service/healthService");
const parseRoute = require("./parseRoute");

const healthRouter = (route, data) => {
    const { param } = parseRoute(route);
    
    switch (param) {
        case "/heartbeat":
            return recieveHeartbeat();
        case "/filebackup":
            return storeFileBackup(data);
        case "/fileparbackup":
            return storeFileParBackup(data);
        default:
            throw new Error("Invalid route");
    }
}

module.exports = { healthRouter };