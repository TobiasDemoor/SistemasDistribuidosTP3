const { countRouter } = require("./countRouter");
const { fileRouter } = require("./fileRouter");
const parseRoute = require("./parseRoute");
const { scanRouter } = require("./scanRouter");

const mainRouter = async (route, data, info) => {
    const {param, rest} = parseRoute(route);
    console.log(param, rest);

    switch (param) {
        case "/file":
            return await fileRouter(rest, data, info);
        case "/count":
            return countRouter(rest, data, info);
        case "/scan":
            return scanRouter(rest, data, info);
        default:
            throw new Error("Invalid route");
    }
}

module.exports = { mainRouter }