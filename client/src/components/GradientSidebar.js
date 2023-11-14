import { useState } from 'react';
import { Button, IconButton, Divider, Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Gradient from './GradientItem';

export default function GradientInfoSidebar() {
    const [gradients, setGradients] = useState([
        {color: '#E3256B', color2: '#BF5E82', value: 'frenchness'},
        {color: '#A23B13', color2: '#123B13', value: 'redness'}
    ]);

    const options = [
      { label: 'Redness', value: 'redness' },
      { label: 'Blueness', value: 'blueness' },
      { label: 'Frenchness', value: 'frenchness' },
    ];

    const addGradient = () => {
        setGradients(bins => [...bins, {color: '#E3256B', color2: '#BF5E82', value: 'New Gradient'}]);
    }

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            {/* Map Info Header */}
            <Typography variant="h6" style={{ margin: '10px' }}>Map of the Pacific Ocean</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
            <Typography variant="subtitle1" style={{ margin: '10px', textAlign: 'center' }}>A graphic showing the amount of water in the Pacific Ocean. It's a lot.</Typography>
            <Divider variant='middle' style={{ width: '80%', margin: '10px', marginTop: '80px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />

            {/* Gradient Data */}
            <Typography variant="h6" style={{ margin: '10px' }}>Gradient Data</Typography>
            <Box sx={{ p: 0, width: '100%', display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>  
                        {/* Gradient List */}
                        {gradients.map((gradient, index) => (
                            <Gradient key={index} gradientColor={gradient.color} gradientColor2={gradient.color2} gradientValue={gradient.value} valueOptions={options}/>
                        ))}
                        
                        {/* Add New Gradient */}
                        <Button 
                            variant="text"
                            sx={{ color: 'black', marginTop: 'auto', marginBottom: '10px', marginLeft: 'auto', marginRight: '5%' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '190px', minHeight: '20px'}} 
                            disableRipple
                            color='razzmatazz'
                            onClick={addGradient}
                        >
                            + New Gradient
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