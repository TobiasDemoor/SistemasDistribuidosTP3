const config = require('config');
const { socketSend } = require('./server');
const repository = require('./repository');
const healthRepository = require('./healthRepository');
const { nodeMissing } = require('./service/healthService')

const heartbeatDaemon = () => {
    const { nextIP, nextPort } = repository.getDHT();
    if (nextIP && nextPort) {
        socketSend({
            route: '/health/heartbeat',
            msg: ":)"
        }, nextIP, nextPort);

        if (!healthRepository.isInRecovery()) {
            healthRepository.incrementHeartbeatCounter();
            if (healthRepository.getHeartbeatCounter() > config.get('heartbeatLimit')) {
                healthRepository.resetHeartbeatCounter();
                nodeMissing();
            }
        }
    }
}

const startHeartbeatDaemon = () => {
    setInterval(heartbeatDaemon, 1000);
}

module.exports = { startHeartbeatDaemon };