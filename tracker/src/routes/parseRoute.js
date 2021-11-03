function parseRoute(route) {
    const i = route.indexOf("/", 1);
    if (i !== -1) {
        const param = route.slice(0, i);
        const rest = route.slice(i);
        return { param, rest };
    } else {
        return { param: route, rest: "" };
    }
}

module.exports = parseRoute;