const express = require('express');
const { getFileRoutes } = require('./fileRoutes');

function getRoutes() {
    const router = express.Router()
    router.use('/file', getFileRoutes())
    return router
}

module.exports = { getRoutes }