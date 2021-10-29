// const {socketSend} = require('./server');
const Repository = require('./repository');

const startAddFile = (data) => {
    const repository = Repository.getInstance();
    let count = repository.getCount();
    if (count == undefined) {
        // get count
    }
    const msg = { file: data };
    const x = Math.floor(Math.random()*count-1);
    const divi = Math.floor(count/2);
    if (x == 0) {
        // nodo actual
    } else if (x > divi) {
        // der
        msg.clockwise = true;
        msg.x = x - divi
    } else if (x <= divi) {
        // izq
        msg.clockwise = false;
        msg.x = x
    }
    // ...
    console.log(msg);
}

const addFile = (data) => {
    console.log(data, "aaaaaaaaaaaaaaaaaaaaaaa");
}

const getCount = (data) => {
    console.log(data, "bbbbbbbbbbbbbbbbbbbbbb");
}

module.exports = {startAddFile, addFile, getCount};
