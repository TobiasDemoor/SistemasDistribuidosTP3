# 16/10/21
Se trabajó en diseñar la arquitectura del conjunto de trackers.

# 25/10/21
Se decidió en clase que los trackers no han de ser interoperables entre los grupos.

# 29/10/21
Se diseñó el esquema de DHT para los trackers. Los trackers mantienen en la cantidad de trackers en el sistema (n), cuando se recibe una solicitud de añadir un nuevo archivo se calcula un valor x random entre 0 y n-1, si es 0 la raíz el archivo es almacenado en el nodo actual. Si x es <= n//2 se envía hacia la izq con el dato x - 1 en el mensaje, si es > n//2 se envía hacia la derecha con el valor x - n//2 - 1 en el mensaje, en ambos casos la dirección como dato (clockwise: bool). Cuando un nodo recibe el mensaje verifica si el valor es 0, si es así lo almacena, sino le resta 1 y reenvia en la dirección que lo recibió. 

```JS
    msg = {
        clockwise: boolean,
        file: Object,
        x: int
    }
```

```JS
    x = Math.floor(Math.random()*n-1)
    divi = Math.floor(n/2)
    if (x == 0) {
        // nodo actual
    } else if (x > divi) {
        // der
        msg.x = x - divi
    } else if (x <= divi) {
        // izq
        msg.x = x
    }
```