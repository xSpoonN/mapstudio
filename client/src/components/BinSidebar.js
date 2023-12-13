import { /* useEffect, useState,  */useContext } from 'react';
import { GlobalStoreContext } from '../store';
import { Button, IconButton, Divider, Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Bin from './BinItem';

export default function BinInfoSidebar({mapData, mapSchema, setMapEditMode}) {
    const { store } = useContext(GlobalStoreContext);

    // The only reason we need to update the schema here is to add a new bin
    const updateSchema = async () => {
        const updatedSchema = {...mapSchema, bins: [...mapSchema.bins, {name: 'New Bin', color: '#E3256B', subdivisions: []}]};
        await store.updateMapSchema(mapData._id, updatedSchema);
    }

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            {/* Map Info Header */}
            <Typography variant="h6" style={{ margin: '10px' }}>{mapData?.title ? mapData.title : ''}</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
            <Typography variant="subtitle1" style={{ margin: '10px', textAlign: 'center' }}>{mapData?.description ? mapData.description : ''}</Typography>
            <Divider variant='middle' style={{ width: '80%', margin: '10px', marginTop: '80px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />

            {/* Bin Data */}
            <Typography variant="h6" style={{ margin: '10px' }}>Bin Data</Typography>
            <Box sx={{ p: 0, width: '100%', display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>  
                        {/* Bin List */}
                        {mapSchema.bins.map((bin, index) => (
                            <Bin key={index} bin={bin} mapSchema={mapSchema} mapData={mapData} setMapEditMode={setMapEditMode}/>
                        ))}

                        {/* Add New Bin */}
                        <Button 
                            variant="text"
                            sx={{ color: 'black', marginTop: 'auto', marginBottom: '10px', marginLeft: 'auto' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '190px', minHeight: '20px'}} 
                            disableRipple
                            color='razzmatazz'
                            onClick={async () => await updateSchema()}
                        >
                            + New Bin
                        </Button>

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