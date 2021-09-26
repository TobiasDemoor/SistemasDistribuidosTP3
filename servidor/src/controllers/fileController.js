
async function getFileList(req, res) {
    // const { id, idActuator, state } = req.body;

    res.status(200).send([
        {
            id: 1,
            name: "Sims 4 full con todas las expansiones"
        },
        {
            id: 2,
            name: "Work and Travel"
        },
        {
            id: 3,
            name: "Gol del diego a los ingleses"
        },
        {
            id: 4,
            name: "Gol de maradona"
        },
        {
            id: 5,
            name: "El diegote con la del mundo"
        }
    ])
}

module.exports = {
    getFileList
}