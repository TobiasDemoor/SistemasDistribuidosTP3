const { countRouter } = require("./countRouter");
const { fileRouter } = require("./fileRouter");
const { scanRouter } = require("./scanRouter");
const { healthRouter } = require("./healthRouter");
const parseRoute = require("../helpers/parseRoute");

const mainRouter = async (route, data, info) => {
    const {param, rest} = parseRoute(route);

    switch (param) {
        case "/file":
            return await fileRouter(rest, data, info);
        case "/count":
            return countRouter(rest, data, info);
        case "/scan":
            return scanRouter(rest, data, info);
        case "/health":
            return healthRouter(rest, data, info);
        default:
            throw new Error("Invalid route");
    }
}

module.exports = { mainRouter }
