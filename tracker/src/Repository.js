class PrivateRepository {
    constructor() {
        console.log("Repository instantiated")
        this.dht = {}
    }

    setInitParams(backIP, backPort, nextIP, nextPort, id, nextId) {
        console.log("Initial parameters loaded")
        this.dht = {
            backIP,
            backPort,
            nextIP,
            nextPort,
            id,
            nextId
        }
    }

    getNodeCount() {

    }

    getBack() {
        const { backIP, backPort } = this.dht;
        return { backIP, backPort };
    }

    getNext() {
        const { nextIP, nextPort } = this.dht;
        return { nextIP, nextPort };
    }

    getId() {
        return this.dht.id;
    }

    getNextId() {
        return this.dht.nextId;
    }
}

class Repository {
    constructor() {
        throw new Error('Use Repository.getInstance()');
    }
    static getInstance() {
        if (!Repository.instance) {
            Repository.instance = new PrivateRepository();
        }
        return Repository.instance;
    }
}


module.exports = Repository;