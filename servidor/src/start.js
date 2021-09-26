async function startServer(port = process.env.PORT) {
    const app = require('./server')

    return new Promise(resolve => {
        const server = app.listen(port, () => {
            console.info(`Connected to port: ${server.address().port}`)

            // this block of code turns `server.close` into a promise API
            const originalClose = server.close.bind(server)

            server.close = async () => {
                return new Promise(resolveClose => {
                    originalClose(resolveClose)
                })
            }
            // this ensures that we properly close the server when the program exists
            setupCloseOnExit(server)
            // resolve the whole promise with the express server
            resolve({ app, server })
        })
    })
}

// ensures we close the server in the event of an error.

function setupCloseOnExit(server) {
    // thank you stack overflow
    // https://stackoverflow.com/a/14032965/971592
    async function exitHandler(options = {}) {
        await server
            .close()
            .then(() => {
                console.info('Server has been shut down successfuly')
            })
            .catch(e => {
                console.warn('An error ocurred while shutting down the server', e.stack)
            })
        if (options.exit) process.exit()
    }

    // do something when app is closing
    process.on('exit', exitHandler)

    // catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }))

    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))

    // catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
}

module.exports = { startServer }