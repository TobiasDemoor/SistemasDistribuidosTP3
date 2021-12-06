const {
    heartbeat, fileBackup, fileParBackup, nodeMissing, setDHTBack, setDHTNext, insertNode, leave
} = require("../service/healthService");
const parseRoute = require("../helpers/parseRoute");

const healthRouter = (route, data) => {
    const { param } = parseRoute(route);

    switch (param) {
        case "/heartbeat":
            return heartbeat();
        case "/fileBackup":
            return fileBackup(data);
        case "/fileParBackup":
            return fileParBackup(data);
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
