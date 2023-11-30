import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
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

export default function ConfirmModal(props) {
    const { store } = useContext(GlobalStoreContext);

    function handleCloseModal() {
        store.closeModal();
    }

    function handlePublish() {
        store.publishMap(props.map, props.map._id)
    }

    return (
        <Modal open={store.modal !== null}>
            <Box sx={style}>
                <div className="modal-dialog">
                <header className="dialog-header">
                    <Alert severity="info" color="info">
                        Publish Map? (This cannot be undone)
                    </Alert>
                </header>
                <div id="confirm-cancel-container">
                    <Button variant="contained"
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handlePublish}
                        sx={{mx:2}}
                    >
                        Ok
                    </Button>
                    <Button variant="contained"
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleCloseModal}
                        sx={{mx:2}}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
            </Box>
        </Modal>
    );
}