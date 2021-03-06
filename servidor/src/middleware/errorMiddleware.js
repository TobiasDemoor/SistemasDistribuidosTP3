
// here's our generic error handler for situations where we didn't handle
// errors properly
function errorMiddleware(error, req, res, next) {
    if (res.headersSent) {
        next(error)
    } else {
        console.error(error)
        res.status(500)
        res.json({
            message: error.message,
            // we only add a `stack` property in non-production environments
            ...(process.env.NODE_ENV === 'production' ? null : { stack: error.stack }),
        })
    }
}

module.exports = errorMiddleware;
