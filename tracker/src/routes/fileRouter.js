const { storeFile, fileSearch, addFilePar } = require("../service/fileService");
const parseRoute = require("./parseRoute");

const fileRouter = async (route, data) => {
    console.debug("File router");
    const { param, rest } = parseRoute(route);
    switch (rest) {
        case "":
            return fileSearch(param.slice(1), data);
        case "/store":
            return await storeFile(data);
        case "/addPar":
            return addFilePar(param.slice(1), data);
        default:
            throw new Error("Invalid route");
    }
}

module.exports = { fileRouter };