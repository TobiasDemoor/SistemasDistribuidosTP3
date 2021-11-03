const { countRouter } = require("./countRouter");
const { fileRouter } = require("./fileRouter");
const parseRoute = require("./parseRoute");

const mainRouter = async (route, data, info) => {
    const {param, rest} = parseRoute(route);
    console.log(param, rest);

    switch (param) {
        case "/file":
            return await fileRouter(rest, data, info);
        case "/count":
            return countRouter(rest, data, info);
        case "/scan":
            console.log("scan route", rest);
            return false;
        default:
            throw new Error("Invalid route");
    }
}

module.exports = { mainRouter }