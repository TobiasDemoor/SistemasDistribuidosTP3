
module.exports = {
    downloads: "downloads",
    ip: "127.0.0.1",
    tcpPort: 4000,
    udpPort: 4000,
    // nodemon se rompe pasando una ruta por parámetro así que para poder testear fácilmente se agrega acá esto
    replicaPaths: [
        "d2", "d3"
    ]
}