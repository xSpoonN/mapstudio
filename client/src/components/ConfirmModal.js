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
        switch (store.modal) {
            case 'publishMap':
                store.publishMap(props.map, props.map._id);
                break;
            case 'deleteMap':
                console.log('deleting map');
                store.deleteMap(props.map._id);
                break;
            default:
                break;
        }
    }

    const modalText = () => {
        switch (store.modal) {
            case 'publishMap':
                return 'Publish Map? (This cannot be undone)';
            case 'deleteMap':
                return 'Delete Map? (This cannot be undone)';
            default:
                return '';
        }
    }

    const okButtonText = () => {
        switch (store.modal) {
            case 'publishMap':
                return 'Ok';
            case 'deleteMap':
                return 'Delete';
            default:
                return 'Ok';
        }
    }

    const cancelButtonText = () => {
        switch (store.modal) {
            case 'publishMap':
                return 'Cancel';
            case 'deleteMap':
                return 'Cancel';
            default:
                return 'Cancel';
        }
    }

    return (
        <Modal open={store.modal !== null}>
            <Box sx={style}>
                <div className="modal-dialog">
                <header className="dialog-header">
                    <Alert severity="info" color="info">
                        {modalText()}
                    </Alert>
                </header>
                <div id="confirm-cancel-container">
                    <Button variant="contained"
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handlePublish}
                        sx={{mx:2}}
                    >
                        {okButtonText()}
                    </Button>
                    <Button variant="contained"
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleCloseModal}
                        sx={{mx:2}}
                    >
                        {cancelButtonText()}
                    </Button>
                </div>
            </div>
            </Box>
        </Modal>
    );
}