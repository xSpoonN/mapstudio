import React, { useState } from 'react';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { TwitterPicker } from 'react-color';

export default function Bin({binColor, binValue}) {
    const [value, setValue] = useState(binValue);
    const [color, setColor] = useState(binColor);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <IconButton sx={{ ml: '2%' }}>
                <AddIcon />
                <RemoveIcon />
                </IconButton>
                <Box sx={{ width: 30, height: 30, backgroundColor: color, borderRadius: '5px', marginRight: '2px' }} onClick={() => setDisplayColorPicker(!displayColorPicker)} />
                <Typography>Bin</Typography>



                <TextField value={value} sx={{ marginLeft: 'auto' }} InputProps={{ sx: { borderRadius: 3 } }} onChange={e => setValue(e.target.value)} />

                <IconButton>
                <DeleteIcon  sx={{ marginLeft: 'auto' }} />  
                </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'right', justifyItems: 'right', marginRight: '15%' }}>  
                {displayColorPicker && (<TwitterPicker color={color} onChangeComplete={color => setColor(color.hex)} sx={{ marginLeft: 'auto'}} triangle='hide'/>)}
            </Box>
        </>
    )
}