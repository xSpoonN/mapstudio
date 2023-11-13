import { useState } from 'react';
import { Button, TextField, FormControl, Select, MenuItem, IconButton, Divider, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { TwitterPicker } from 'react-color';

export default function SubdivisionInfoSidebar() {
    const [name, setName] = useState('New Zealand');
    const [dropdownValue, setDropdownValue] = useState('Option 1');
    const [value, setValue] = useState('13');
    const [size, setSize] = useState(3); 
    const [color, setColor] = useState('#E3256B');
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            {/* Map Info Header */}
            <Typography variant="h6" style={{ margin: '10px' }}>Map of the Pacific Ocean</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
            <Typography variant="subtitle1" style={{ margin: '10px', textAlign: 'center' }}>A graphic showing the amount of water in the Pacific Ocean. It's a lot.</Typography>
            <Divider variant='middle' style={{ width: '80%', margin: '10px', marginTop: '80px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />

            {/* Subdivision Data */}
            <Typography variant="h6" style={{ margin: '10px' }}>Subdivision Data</Typography>
            <Box sx={{ p: 0, width: '100%', display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                    {/* Subdivision Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ mr: 1, ml: '10%' }}>Name</Typography>  
                        <TextField value={name} sx={{ marginLeft: 'auto' }} InputProps={{ sx: { borderRadius: 3 } }} onChange={e => setName(e.target.value)} />

                        {/* Placeholder to take up space for alignment */}
                        <IconButton disabled={true}>
                        <CheckIcon  sx={{ marginLeft: 'auto', color: 'white' }} />  
                        </IconButton>
                    </Box>

                    {/* Subdivision Properties */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <FormControl sx={{ mr: 1, ml: '10%' }}>
                        <Select value={dropdownValue} onChange={e => setDropdownValue(e.target.value)} sx={{ borderRadius: 3 }}>
                            <MenuItem value="Option 1">Option 1</MenuItem>
                            <MenuItem value="Option 2">Option 2</MenuItem>
                        </Select>
                        </FormControl>

                        <TextField value={value} sx={{ margin: '2px', marginLeft: 'auto', width: '100px' }}
                        inputProps={{style: { textAlign: 'center'}}} InputProps={{ sx: { borderRadius: 3 } }}
                        onChange={e => setValue(e.target.value)}/>
                        
                        <IconButton>
                        <DeleteIcon  sx={{ marginLeft: 'auto' }} />  
                        </IconButton>
                    </Box>

                    {/* Subdivision Size */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ mr: 1, ml: '10%' }}>Weight</Typography>

                        <IconButton sx={{ marginLeft: 'auto'}} onClick={() => setSize(size - 1)}>
                        <RemoveIcon />
                        </IconButton>

                        <TextField value={size} sx={{ width: '50px', margin: '2px' }} 
                        inputProps={{style: { textAlign: 'center'}}} InputProps={{ sx: { borderRadius: 3 } }}
                        onChange={e => setSize(Number(e.target.value))}/>

                        <IconButton  onClick={() => setSize(size + 1)}>
                        <AddIcon />
                        </IconButton>
                    </Box>

                    {/* Subdivision Color */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>  
                        <Typography sx={{ mr: 1, ml: '10%' }}>Color</Typography>
                        <Box sx={{ width: 30, height: 30, borderRadius: '5px', backgroundColor: color, marginLeft: 'auto' }} onClick={() => setDisplayColorPicker(!displayColorPicker)} />

                        {/* Placeholder to take up space for alignment */}
                        <IconButton disabled={true}>
                        <CheckIcon  sx={{ marginLeft: 'auto', color: 'white' }} />  
                        </IconButton>
                    </Box>

                    {/* Color Pickers */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'right', justifyItems: 'right', marginRight: '15%' }}>  
                        {displayColorPicker && (<TwitterPicker color={color} onChangeComplete={color => setColor(color.hex)} sx={{ marginLeft: 'auto'}} triangle='hide'/>)}
                    </Box>

                    {/* Add New Property */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
                        <Button 
                            variant="contained"
                            sx={{ color: 'white', mx: 1, marginTop: 'auto', marginBottom: '10px' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '190px', minHeight: '20px'}} 
                            disableRipple
                            color='razzmatazz'
                        >
                            Add New Property
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}