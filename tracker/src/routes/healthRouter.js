const { recieveHeartbeat, storeFileBackup, storeFileParBackup, nodeMissing, setDHTBack, setDHTNext, insertNode, leave } = require("../service/healthService");
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
        case "/nodeMissing":
            return nodeMissing(data);
        case "/setDHTBack":
            return setDHTBack(data);
        case "/setDHTNext":
            return setDHTNext(data);
        case "/insertNode":
            return insertNode(data);
        case "/leave":
            return leave(data);
        default:
            throw new Error("Invalid route");
    }
}

module.exports = { healthRouter };