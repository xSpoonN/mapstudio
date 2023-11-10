import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

export default function AccountModal() {
    const { store } = useContext(GlobalStoreContext);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        //bgcolor: 'background.paper',
        //border: '2px solid #000',
        //boxShadow: 24,
        //p: 4,
    };

    let msg
    let severity = "error"
    if (store.currentScreen === 'login') {
        msg = 'Incorrect account details'
    } else if (store.currentScreen === 'register') {
        msg = 'Email or username already in use'
    } else if (store.currentScreen === 'forgot') {
        msg = 'Recovery code sent'
        severity = "success"
    }

    function handleCloseModal() {
        store.closeModal()
    }

    return (
        <Modal open={store.modal !== null}>
            <Box sx={style}>
                <div className="modal-dialog">
                <header className="dialog-header">
                    <Alert severity={severity}>
                        {msg}
                    </Alert>
                </header>
                <div id="confirm-cancel-container">
                    <Button variant="contained"
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleCloseModal}
                        sx={{ color: 'white' }}
                        color='razzmatazz'
                    >
                        Close
                    </Button>
                </div>
            </div>
            </Box>
        </Modal>
    )
}