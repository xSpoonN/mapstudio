import { useContext } from 'react'
import AuthContext from '../auth'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
};

export default function AccountErrorModal() {
    const { auth } = useContext(AuthContext);
    let error = "";
    if (auth.error) {
        error = auth.error;
    }

    function handleCloseModal() {
        auth.closeErrorModal();
    }

    return (
        <Modal
            open={auth.error !== null}
        >
            <Box sx={style}>
                <div className="modal-dialog">
                <header className="dialog-header">
                    <Alert severity="warning" color="info">
                        {error}
                    </Alert>
                </header>
                <div id="confirm-cancel-container">
                    <Button variant="contained"
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleCloseModal}
                    >
                        Close
                    </Button>
                </div>
            </div>
            </Box>
        </Modal>
    );
}