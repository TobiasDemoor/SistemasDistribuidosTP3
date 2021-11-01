const sha1 = require('sha1');

async function getFileList(req, res) {
    //TODO: request tracker
    res.status(200).send([
        {
            id: 1,
            filename: "Sims 4 full con todas las expansiones",
            filesize: 23
        },
        {
            id: 2,
            filename: "Work and Travel",
            filesize: 23
        },
        {
            id: 3,
            filename: "Gol del diego a los ingleses",
            filesize: 23
        },
        {
            id: 4,
            filename: "Gol de maradona",
            filesize: 23
        },
        {
            id: 5,
            filename: "El diegote con la del mundo",
            filesize: 23
        }
    ])
}


async function getFileById(req, res) {
    const {id} = req.params;
    
    //TODO: request tracker for correct fileData
    const fileText = JSON.stringify({ hash: id, trackerIp: "localhost", trackerPort: "2000" });
    const fileData = Buffer.from(fileText).toString("base64");
    const fileName = `${id}.torrente`
  
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': 'text/plain',
    });
  
    const download = Buffer.from(JSON.stringify(fileData), 'base64');
    res.end(download);
}

async function uploadNewFile(req, res) {
    const body = req.body;
    const { name, size } = body;
    const id = sha1(name + size);
    console.log(id, body);
    res.status(200).send(body);
}

module.exports = {
    getFileList,
    getFileById,
    uploadNewFile
}