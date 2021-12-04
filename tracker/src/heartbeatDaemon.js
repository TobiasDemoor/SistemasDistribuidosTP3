const config = require('config');
const { socketSend } = require('./server');
const repository = require('./repository');
const healthRepository = require('./healthRepository');
const { startRecovery } = require('./service/healthService')

const heartbeatDaemon = () => {
    const { nextIP, nextPort } = repository.getDHT();
    if (nextIP && nextPort) {
        socketSend({
            route: '/health/heartbeat',
            msg: ":)"
        }, nextIP, nextPort, false);

        if (!healthRepository.isInRecovery()) {
            healthRepository.incrementHeartbeatCounter();
            if (healthRepository.getHeartbeatCounter() > config.get('heartbeatLimit')) {
                healthRepository.resetHeartbeatCounter();
                startRecovery();
            }
        }
    }
}

const startHeartbeatDaemon = () => {
    setInterval(heartbeatDaemon, 1000);
}

module.exports = { startHeartbeatDaemon };
