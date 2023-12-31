import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import { Button, IconButton, Divider, Box, Typography, Snackbar, Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Gradient from './GradientItem';

export default function GradientInfoSidebar({mapData, mapSchema, setMapEditMode}) {
    const { store } = useContext(GlobalStoreContext);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const snackbarTimeout = 2000;

    // The only reason we need to update the schema here is to add a new gradient
    const updateSchema = async () => {
        // Get all unique data fields from subdivisions
        const dataFieldsSet = new Set();
        mapSchema?.subdivisions?.forEach(subdivision => {
            Object.keys(subdivision.data || {}).forEach(key => dataFieldsSet.add(key));
        })
        const dataFields = [...dataFieldsSet];

        // Find a data field with no gradient yet
        let unusedKey;
        for (const key of dataFields) {
            if (!mapSchema.gradients.some(gradient => gradient.dataField === key)) {
                unusedKey = key;
                break;
            }
        }
        if (!unusedKey) {
            setOpenSnackbar(true);
            return;
        }

        console.log(unusedKey)

        // Get subdivisions that have the data field
        const keySubdivisions = mapSchema.subdivisions.filter(subdivision => Object.keys(subdivision.data || {}).includes(unusedKey)).map(subdivision => subdivision.name);

        // Add the new gradient
        const updatedSchema = {...mapSchema, gradients: [...mapSchema.gradients, {dataField: unusedKey, minColor: '#DDDDDD', maxColor: '#DDDDDD', subdivisions: keySubdivisions}]};
        await store.updateMapSchema(mapData._id, updatedSchema);
    }

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            {/* Map Info Header */}
            <Typography variant="h6" style={{ margin: '10px' }}>{mapData?.title ? mapData.title : ''}</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
            <Typography variant="subtitle1" style={{ margin: '10px', textAlign: 'center', minHeight: '160px', maxHeight: '160px', overflow: 'scroll' }}>{mapData?.description ? mapData.description : ''}</Typography>
            <Divider variant='middle' style={{ width: '80%', margin: '10px', marginTop: '40px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />

            {/* Gradient Data */}
            <Typography variant="h6" style={{ margin: '10px' }}>Gradient Data</Typography>
            <Box sx={{ p: 0, width: '100%', display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>  
                        {/* Gradient List */}
                        {mapSchema?.gradients.map((gradient, index) => (
                            <Gradient key={index} gradient={gradient} mapSchema={mapSchema} mapData={mapData} setMapEditMode={setMapEditMode}/>
                        ))}
                        
                        {/* Add New Gradient */}
                        <Button 
                            variant="text"
                            sx={{ color: 'black', marginTop: 'auto', marginBottom: '10px', marginLeft: 'auto' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '190px', minHeight: '20px'}} 
                            disableRipple
                            color='razzmatazz'
                            onClick={async () => await updateSchema()}
                        >
                            + New Gradient
                        </Button>

                        {/* Alerts/Snackbar */}
                        <Snackbar
                        open={openSnackbar}
                        autoHideDuration={snackbarTimeout}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        onClose = {(event, reason) => {
                            if (reason === 'clickaway' || reason === 'escapeKeyDown') return;
                            setOpenSnackbar(false);
                        }}
                        >
                            <Alert action={null} onClose={() => {
                                setOpenSnackbar(false);
                            }} severity='error' sx={{ width: '100%' }}>No more data fields to add gradient for</Alert>
                        </Snackbar>

                        {/* Placeholder to take up space for alignment */}
                        <IconButton disabled={true}>
                        <CheckIcon  sx={{ marginLeft: 'auto', color: 'white' }} />  
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}