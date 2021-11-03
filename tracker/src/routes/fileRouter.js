const { storeFile } = require("../service/fileService");
const parseRoute = require("./parseRoute");

const fileRouter = async (route, data) => {
    console.debug("File router");
    const { param, rest } = parseRoute(route);
    switch (rest) {
        case "":
            console.log("file search hash: ", param);
            return false;
        case "/found":
            console.log("file found hash: ", param);
            return false;
        case "/store":
            return await storeFile(data);
        default:
            throw new Error("Invalid route");
    }
}

module.exports = { fileRouter };