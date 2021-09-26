"use strict";
const express = require('express');
const file = require('../controllers/fileController');


function getFileRoutes() {
    const router = express.Router();
    router.get('', file.getFileList);
    return router;
}

module.exports = { getFileRoutes };
