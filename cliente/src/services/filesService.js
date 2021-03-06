import handleResponse from "./responseService";

// eslint-disable-next-line no-undef
const serverUrl = process.env.REACT_APP_SERVER_URL;

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
    fetch(`${serverUrl}/file/`,  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            filename: name,
            filesize: size,
            nodeIP,
            nodePort
        })
     }).then(handleResponse);
}
