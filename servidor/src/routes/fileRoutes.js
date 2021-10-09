"use strict";
const express = require('express');
const file = require('../controllers/fileController');


function getFileRoutes() {
    const router = express.Router();
    router.get('', file.getFileList);
    router.get('/:id', file.getFileById);
    router.post('/', file.uploadNewFile);
    return router;
}

module.exports = { getFileRoutes };
