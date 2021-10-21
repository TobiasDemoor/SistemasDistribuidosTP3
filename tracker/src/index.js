const { startSocket } = require('./server');
const Repository = require('./Repository');

if (process.argv.length != 9) {
    throw Error("Mandame todos los parámetros \n" +
        "port, backIP, backPort, nextIP, nextPort, id, nextId")
}

const [port, backIP, backPort, nextIP, nextPort, id, nextId] = process.argv.slice(2);
console.log(port, backIP, backPort, nextIP, nextPort, id, nextId);
const repository = Repository.getInstance();
repository.setInitParams(backIP, parseInt(backPort), nextIP, parseInt(nextPort), id, nextId)
console.log(repository.getBack());
console.log(repository.getNext());
startSocket(parseInt(port));