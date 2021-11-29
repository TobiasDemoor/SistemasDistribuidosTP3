const { getCount } = require("../service/countService");

const countRouter = (_route, data) => {
    console.debug("Count router");
    return getCount(data);
}

module.exports = { countRouter };