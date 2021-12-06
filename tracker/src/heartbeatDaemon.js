const config = require('config');
const repository = require('./repository');
const healthRepository = require('./healthRepository');
const { startRecovery } = require('./service/healthService')

const heartbeatDaemon = () => {
    const { socketSend } = require('./server');
    const { nextIP, nextPort } = repository.getDHT();
    if (nextIP && nextPort) {
        socketSend({
            msg: {
                route: '/health/heartbeat',
                msg: ":)"
            },
            ip: nextIP,
            port: nextPort,
            echo: false
        });

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
    return setInterval(heartbeatDaemon, 1000);
}

module.exports = { startHeartbeatDaemon };
