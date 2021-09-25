import React, { useState } from 'react';
import { TextField, Button, Typography, withStyles } from '@material-ui/core';
import Loader from './common/Loader';
import { sendNewFile } from '../services/filesService';

const style = theme => ({
    header: {
        display: "flex",
    },
    title: {
        margin: theme.spacing(2),
        marginLeft: 0,
        color: theme.palette.text.primary,
    },
    sentText: {
        marginRight: 0,
        margin: "auto",
    },
    container: {
        marginTop: theme.spacing(2)
    },
    element: {
        marginTop: theme.spacing(3),
        margin: "auto"
    }
})


function NewFileForm({ classes, ...rest }) {
    const [name, setName] = useState("");
    const [size, setSize] = useState("");
    const [nodeIP, setNodeIP] = useState("");
    const [nodePort, setNodePort] = useState("");

    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);


    const submit = async (e) => {
        e.preventDefault();
        setSending(true);
        await sendNewFile(name, size, nodeIP, nodePort);
        setSent(true);
        setSending(false);
    }

    return (
        <div {...rest}>
            <div className={classes.header}>
            <Typography className={classes.title}  variant="h4">
                Subir archivo
            </Typography>
            {sent && <Typography className={classes.sentText} variant="p">¡Enviado!</Typography>}
            </div>
            <form onSubmit={submit}>
                <TextField
                    className={classes.element}
                    id="filename"
                    label="Nombre"
                    fullWidth
                    variant="outlined"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <TextField
                    className={classes.element}
                    id="size"
                    label="Tamaño"
                    type="number"
                    inputProps={{ min: 0 }}
                    fullWidth
                    variant="outlined"
                    required
                    value={size}
                    onChange={e => setSize(e.target.value)}
                />
                <TextField
                    className={classes.element}
                    id="nodeIP"
                    label="IP Nodo Contenedor"
                    fullWidth
                    variant="outlined"
                    required
                    value={nodeIP}
                    onChange={e => setNodeIP(e.target.value)}
                />
                <TextField
                    className={classes.element}
                    id="nodePort"
                    label="Puerto Nodo Contenedor"
                    type="number"
                    inputProps={{ min: 0 }}
                    fullWidth
                    variant="outlined"
                    required
                    value={nodePort}
                    onChange={e => setNodePort(e.target.value)}
                />

                {sending ? <Loader /> : (
                    <Button
                        className={classes.element}
                        type="submit"
                        id="submit"
                        fullWidth
                        color="primary"
                        variant="contained"
                        disabled={sent}
                    >
                        ENVIAR
                    </Button>
                )}
            </form>
        </div>
    )
}

export default withStyles(style)(NewFileForm);