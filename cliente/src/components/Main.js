import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Modal, Paper, withStyles, IconButton} from '@material-ui/core';
import { getFile, getFileList } from '../services/filesService';
import RefreshIcon from '@material-ui/icons/Refresh';
import Loader from './common/Loader';
import NewFileForm from './NewFileForm';

const style = theme => ({
    header: {
        margin: theme.spacing(2),
        display:'flex',
        marginLeft: 0,
        marginRight: 0,
    },
    title: {
        margin: theme.spacing(2),
        marginLeft: 0,
        color: theme.palette.text.primary,
    },
    sendButton: {
        margin: 'auto',
        marginRight: 0,
    },
    refresh: {
        float: 'auto',
        color: theme.palette.text.primary
    },
    element: {
        "&:hover": {
            backgroundColor: theme.palette.grey[200]
        },
        margin: theme.spacing(2)
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
    const [errorMessage, setErrorMessage] = useState('');
    const onRefresh = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const result = await getFileList();
            setFileList(result? result: []);
        } catch(err) {
            console.log(err);
            setErrorMessage(err);
        }
        setLoading(false);
    }
    useEffect(onRefresh, []);

    const onClickGetFile = (file) => {
        setErrorMessage('');
        try {
            getFile(file);
        } catch(err) {
            console.log(err);
            setErrorMessage(err);
        }
    }

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
                    <IconButton
                        className={classes.refresh}
                        onClick={onRefresh}
                        id="refresh"
                    >
                        <RefreshIcon />
                    </IconButton>
                    <Button
                        className={classes.sendButton}
                        variant="contained"
                        color="primary"
                        onClick={() => setModalOpen(true)}
                    >
                        Subir archivo
                    </Button>     
                </div>
                {loading? <Loader /> :
                    errorMessage? <Typography> {errorMessage} </Typography> :
                    <>
                        {fileList.map(file =>
                            <FileSummary
                                className={classes.element}
                                key={JSON.stringify(file)}
                                file={file}
                                onClick={() => onClickGetFile(file)}
                            />
                        )}
                    </>
                }
            </Container>
        </>
    )
}

function FileSummary({ file, ...rest }) {
    const { filename, filesize } = file;
    return (
        <div {...rest}>
            <Typography variant="h6">
                {/* {JSON.stringify(file)} */}
                {filename}
            </Typography>
            <Typography paragraph> Tama??o: {filesize} Bytes </Typography>
        </div>
    )
}


export default withStyles(style)(Main);