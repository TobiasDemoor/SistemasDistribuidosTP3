module.exports = {
    express: {
        port: process.env.PORT || 5000,
    },
    comunication: {
        timeout: 15000
    },
    tracker: {
        ip: "127.0.0.1",
        port: 2000
    },
    cache: {
        validFor: 60000
    },
    udp: {
        ip: "127.0.0.1",
        port: 2500
    }
}