

async function getFileList(req, res) {
    //TODO: request tracker
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


async function getFileById(req, res) {
    const {id} = req.params;
    
    //TODO: request tracker for correct fileData
    const fileText = JSON.stringify({ trackerIp: "localhost", trackerPort: "2000" });
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
    console.log(body);
    res.status(200).send(body);
}

module.exports = {
    getFileList,
    getFileById,
    uploadNewFile
}