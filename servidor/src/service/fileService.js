const sha1 = require('sha1');
const trackerRepository = require('../trackerRepository');

const storeFile = async (file) => {
    const { filename, filesize, nodeIP: parIP, nodePort: parPort } = file;
    const id = sha1(filename + filesize);
    const data = { id, filename, filesize, pares: [{parIP, parPort}] };
    return await trackerRepository.storeFile(data);
}

const searchFile = async (fileId) => {
    return await trackerRepository.searchFile(fileId);
}

const scanFiles = async () => {
    return await trackerRepository.scanFiles();
}

module.exports = {
    storeFile,
    searchFile,
    scanFiles
}