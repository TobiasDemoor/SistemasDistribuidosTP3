const { fileScan } = require("../service/scanService");

const scanRouter = (_route, data) => {
    return fileScan(data);
}

module.exports = { scanRouter };