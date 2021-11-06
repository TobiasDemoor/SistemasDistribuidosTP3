const { fileScan } = require("../service/scanService");

const scanRouter = (_route, data) => {
    console.debug("Scan router");
    return fileScan(data);
}

module.exports = { scanRouter };