import React, { useState } from 'react';
import { Box, Select, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { TwitterPicker } from 'react-color';

export default function Gradient({gradientColor, gradientColor2, gradientValue, valueOptions}) {
    const [value, setValue] = useState(gradientValue);
    const [color, setColor] = useState(gradientColor);
    const [color2, setColor2] = useState(gradientColor2);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [displayColorPicker2, setDisplayColorPicker2] = useState(false);

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {/* Add/Remove from Gradient */}
                <IconButton sx={{ ml: '2%' }}>
                <AddIcon />
                <RemoveIcon />
                </IconButton>
                {/* Color squares */}
                <Box sx={{ width: 30, height: 30, backgroundColor: color, borderRadius: '5px', marginRight: '2px' }} onClick={() => setDisplayColorPicker(!displayColorPicker)} />
                <Box sx={{ width: 30, height: 30, backgroundColor: color2, borderRadius: '5px', marginRight: '2px' }} onClick={() => setDisplayColorPicker2(!displayColorPicker2)} />
                {/* Gradient value dropdown */}
                <Select 
                    value={value}
                    sx={{ marginLeft: 'auto' }}
                    InputProps={{ sx: { borderRadius: 3 } }}
                    onChange={e => setValue(e.target.value)}  
                >
                    {valueOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </MenuItem>
                    ))}
                </Select>

                {/* Delete Gradient */}
                <IconButton>
                <DeleteIcon  sx={{ marginLeft: 'auto' }} />  
                </IconButton>
            </Box>

            {/* Color Pickers */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'right', justifyItems: 'right', marginRight: '15%' }}>  
                {displayColorPicker && (<TwitterPicker color={color} onChangeComplete={color => setColor(color.hex)} sx={{ marginLeft: 'auto'}} triangle='hide'/>)}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'right', justifyItems: 'right', marginRight: '15%' }}>  
                {displayColorPicker2 && (<TwitterPicker color={color2} onChangeComplete={color => setColor2(color.hex)} sx={{ marginLeft: 'auto'}} triangle='hide'/>)}
            </Box>
        </>
    )
}