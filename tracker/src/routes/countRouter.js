const { getCount, clearCount } = require("../service/countService");

const countRouter = (route, data) => {
    switch (route) {
        case "/clear":
            return clearCount(data);
        case "":
            return getCount(data);
        default:
            throw new Error("Invalid route");
    }
}

module.exports = { countRouter };
