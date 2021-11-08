const { storeFile, searchFile, scanFiles } = require('../service/fileService');

async function getFileList(req, res) {
    const data = await scanFiles();
    res.status(200).send(data);
}

async function getFileById(req, res) {
    const {id} = req.params;
    const data = await searchFile(id);

    // const fileText = JSON.stringify({ hash: id, trackerIp: "localhost", trackerPort: "2000" });
    const fileText = JSON.stringify(data);
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
    const body = req.body
    console.log("Upload new file", body);
    const data = await storeFile(body);
    res.status(200).send(data);
}

module.exports = {
    getFileList,
    getFileById,
    uploadNewFile
}