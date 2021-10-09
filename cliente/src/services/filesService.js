import sha1 from 'sha1';
import handleResponse from "./responseService";

const serverUrl = "http://localhost:5000";

export async function getFileList(){
    return fetch(`${serverUrl}/file`).then(handleResponse);
}

export async function getFile(file) {
    var link = document.createElement("a");
    link.href = `${serverUrl}/file/${file.id}`;
    link.download = true;

    link.click();    
}

export async function sendNewFile(name, size, nodeIP, nodePort){
    console.log(name, size, nodeIP, nodePort);
    const id = sha1(name+size);
    fetch(`${serverUrl}/file/`,  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            id,
            filename: name,
            filesize: size,
            nodeIP,
            nodePort
        })
     }).then(handleResponse);
}
