# Tracker
Aplicación de nodo tracker para el trabajo práctico
# Start
Teniendo node instalado
```sh
npm i
npm start <IP> <port> <IP_trackerConocido> <Port_trackerConocido>   # envía el mensaje de join al tracker conocido para unirse a la red
npm start <IP> <port> <backIP> <backPort> <nextIP> <nextPort>       
```

## Scripts
```sh
npm run dev     # para iniciar la red de 3 trackers con nodemon
npm run demo1   # para correr 3 trackers configurados sin nodemon
npm run demo2   # para levantar un tracker y que haga el join a la red anterior
```