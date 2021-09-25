import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Modal, Paper, withStyles } from '@material-ui/core';
import { getFile, getFileList } from '../services/filesService';
import Loader from './common/Loader';
import NewFileForm from './NewFileForm';

const style = theme => ({
    header: {
        margin: theme.spacing(2),
        display: "flex",
        marginLeft: 0,
        marginRight: 0,
    },
    title: {
        margin: theme.spacing(2),
        marginLeft: 0,
        color: theme.palette.text.primary,
    },
    sendButton: {
        marginRight: 0,
        margin: "auto",
    },
    element: {
        "&:hover": {
            backgroundColor: theme.palette.grey[200]
        }
    },
    modal: {
        marginTop: "20%",
        padding: theme.spacing(5),
        textAlign: "center"
    },
})

function Main({ classes }) {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(async () => {
        setLoading(true);
        const result = await getFileList();
        setFileList(result);
        setLoading(false);
    }, []);

    if (loading)
        return <Loader />;

    return (
        <>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Container maxWidth="sm">
                    <Paper className={classes.modal}>
                        <NewFileForm />
                    </Paper>
                </Container>
            </Modal>

            <Container maxWidth='md'>
                <div className={classes.header}>
                    <Typography className={classes.title} variant='h4'>
                        Archivos
                    </Typography>
                    <Button
                        className={classes.sendButton}
                        variant="contained"
                        color="primary"
                        onClick={() => setModalOpen(true)}
                    >
                        Subir archivo
                    </Button>
                </div>
                {fileList.map(file =>
                    <FileSummary
                        className={classes.element}
                        key={JSON.stringify(file)}
                        file={file}
                        onClick={() => getFile(file)}
                    />
                )}
            </Container>
        </>
    )
}

function FileSummary({ file, ...rest }) {
    return (
        <div {...rest}>
            <Typography>
                {JSON.stringify(file)}
            </Typography>
        </div>
    )
}


export default withStyles(style)(Main);