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

    function handleConfirm() {
        switch (props.type) {
            case 'publishMap':
                store.publishMap(props.map, props.map._id);
                break;
            case 'deleteMap':
                store.deleteMap(props.map._id);
                break;
            case 'applyTemplate_Bin Map':
            case 'applyTemplate_Gradient Map':
            case 'applyTemplate_Heat Map':
            case 'applyTemplate_Point Map':
            case 'applyTemplate_Satellite Map':
                props.applyTemplate();
                break;
            default:
                break;
        }
    }

    const modalText = () => {
        switch (props.type) {
            case 'publishMap':
                return 'Publish Map? (This cannot be undone)';
            case 'deleteMap':
                return 'Delete Map? (This cannot be undone)';
            case 'applyTemplate_Bin Map':
            case 'applyTemplate_Gradient Map':
            case 'applyTemplate_Heat Map':
            case 'applyTemplate_Point Map':
            case 'applyTemplate_Satellite Map':
                return 'Apply Template? (This will OVERWRITE your current map)';
            default:
                return '';
        }
    }

    const okButtonText = () => {
        switch (props.type) {
            case 'publishMap':
                return 'Ok';
            case 'deleteMap':
                return 'Delete';
            default:
                return 'Confirm';
        }
    }

    const cancelButtonText = () => {
        switch (props.type) {
            default:
                return 'Cancel';
        }
    }

    return (
        <Modal open={store.modal && store.modal === props.type}>
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
                        onClick={handleConfirm}
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