module.exports = {
    socket: {
        port: process.env.PORT || 2000,
        backIP: "127.0.0.1", 
        backPort: 1999, 
        nextIP: "127.0.0.1", 
        nextPort: 2001, 
    },
    messageIdLifespan: 60000
}