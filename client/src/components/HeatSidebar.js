import React ,{ useState, useEffect } from 'react';
import { Button, Divider, Box, Slider, Typography } from '@mui/material';
import 'leaflet.heat';

export default function HeatMapSidebar({ mapSchema, onHeatMapChange, uploadCSV }) {
    const initialRadius = mapSchema.heatmaps && mapSchema.heatmaps.length > 0 ? mapSchema.heatmaps[0].radius : 25;
    const initialBlur = mapSchema.heatmaps && mapSchema.heatmaps.length > 0 ? mapSchema.heatmaps[0].blur : 15;
    const [radius, setRadius] = useState(initialRadius);
    const [blur, setBlur] = useState(initialBlur);

    useEffect(() => {
        if(initialRadius !== radius || initialBlur !== blur){
            onHeatMapChange(radius, blur);
        }
        
    }, [radius, blur]);

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Typography variant="h6" style={{ margin: '10px' }}>Heat Map</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} />
            
            <Box 
                sx={{
                    width:'70%',mt:8, mb: 2, 
                    '& .MuiSlider-thumb': {
                    color: '#E3256B',
                    },
                    '& .MuiSlider-track': {
                        color: '#E3256B', 
                }}}
            >
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
            <Box
                sx={{
                    width:'70%',mb: 2, 
                    '& .MuiSlider-thumb': {
                    color: '#E3256B', 
                    },
                    '& .MuiSlider-track': {
                        color: '#E3256B', 
                }}}
            >
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

            <Button variant="contained" component="label" style={{ margin: '10px', backgroundColor: '#E3256B'}}>
                Upload new CSV File
                <input type="file" accept='.csv' hidden onChange={uploadCSV} />
            </Button>
        </Box>
    );
}
