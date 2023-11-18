import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { Box, Button, Modal, Alert, TextField, Typography} from '@mui/material';

export default function AccountModal() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await auth.verifyResetToken(password);
            if (!resp.success) {
                setErr(resp.message);
                return console.log(resp);
            }
            store.changeToRecover();
        } catch (error) {
            console.log(error);
        }
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
                { store.currentScreen === 'forgot' && 
                    <TextField
                        label="Token" 
                        type="password"
                        value={password}
                        sx= {{ marginLeft: 'auto', marginRight: 'auto', width: '80%' }}
                        onChange={(e) => setPassword(e.target.value)} 
                    />}
                {err && <Typography variant="body2" color='red'>
                    {err}
                </Typography>}
                <div id="confirm-cancel-container">
                    { store.currentScreen === 'forgot' && 
                        <>
                            <Button variant="contained"
                                id="dialog-no-button"
                                className="modal-button"
                                onClick={handleCloseModal}
                                sx={{ color: 'white' }}
                                color='razzmatazz'
                            >
                                Cancel
                            </Button>
                            <Button variant="contained"
                                id="dialog-no-button"
                                className="modal-button"
                                onClick={handleSubmit}
                                sx={{ color: 'white' }}
                                color='razzmatazz'
                            >
                                Submit
                            </Button>
                        </>
                    }

                    { store.currentScreen !== 'forgot' && 
                        <Button variant="contained"
                            id="dialog-no-button"
                            className="modal-button"
                            onClick={handleCloseModal}
                            sx={{ color: 'white' }}
                            color='razzmatazz'
                        >
                            Close
                        </Button>
                    }
                </div>
            </div>
            </Box>
        </Modal>
    )
}