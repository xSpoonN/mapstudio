import React ,{ useState, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import { Button, Divider, Box, Slider, Typography } from '@mui/material';

import 'leaflet.heat';
import { map } from 'leaflet';

export default function HeatMapSidebar({ mapData, mapSchema, onHeatMapChange}) {
    const initialRadius = mapSchema.heatmaps && mapSchema.heatmaps.length > 0 ? mapSchema.heatmaps[0].radius : 25;
    const initialBlur = mapSchema.heatmaps && mapSchema.heatmaps.length > 0 ? mapSchema.heatmaps[0].blur : 15;
    const [radius, setRadius] = useState(initialRadius);
    const [blur, setBlur] = useState(initialBlur);
    
    // trigger the handleFileUpload function from EditMap.js
    // const triggerFileUpload = () => {
    //     const fileInput = document.createElement('input');
    //     fileInput.type = 'file';
    //     fileInput.accept = '.csv';
    //     fileInput.onchange = (event) => {
    //         handleFileUpload(event);
    //     };
    //     fileInput.click();
    // };
    useEffect(() => {
        if(initialRadius !== radius || initialBlur !== blur){
            onHeatMapChange(radius, blur);
        }
        
    }, [radius, blur]);


    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Typography variant="h6" style={{ margin: '10px' }}>Heat Map</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} />
            
            {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <Typography variant="subtitle1" style={{ margin: '10px', textAlign: 'center' }}>Radius</Typography>
                <input type="range" min="10" max="50"  class="slider" id="myRange" />
                <Typography variant="subtitle1" style={{ margin: '10px', textAlign: 'center' }}>Blur</Typography>
                <input type="range" min="10" max="50"  class="slider" id="myRange" />
            </Box> */}

            <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Radius</Typography>
                <Slider
                    value={radius}
                    onChange={(e, newValue) => setRadius(newValue)}
                    aria-labelledby="radius-slider"
                    valueLabelDisplay="auto"
                    min={10}
                    max={50}
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Blur</Typography>
                <Slider
                    value={blur}
                    onChange={(e, newValue) => setBlur(newValue)}
                    aria-labelledby="blur-slider"
                    valueLabelDisplay="auto"
                    min={10}
                    max={50}
                />
            </Box>

            <Button variant="contained" component="label" style={{ margin: '10px' }}>
                Upload new CSV File
                {/* <input type="file" accept='.csv' hidden onChange={triggerFileUpload} /> */}
            </Button>
        </Box>
    );
}
