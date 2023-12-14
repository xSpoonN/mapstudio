import { useState, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import { Button, Divider, Box, Typography } from '@mui/material';
import L from 'leaflet';
import 'leaflet.heat';

export default function HeatMapSidebar({ map, handleFileUpload}) {

    const triggerFileUpload = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.onchange = (event) => {
            handleFileUpload(event);
            // 您可能还需要在这里添加一些额外的处理，比如更新地图上的热力图层


        };
        fileInput.click();
    };


    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Typography variant="h6" style={{ margin: '10px' }}>Heat Map</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} />
            <Button variant="contained" component="label" style={{ margin: '10px' }}>
                Upload Your CSV File
                <input type="file" accept='.csv' hidden onChange={triggerFileUpload} />
            </Button>
        </Box>
    );
}
