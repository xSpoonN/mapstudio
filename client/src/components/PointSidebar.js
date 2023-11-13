import { useState } from 'react';
import { Button, TextField, FormControl, Select, MenuItem, IconButton, Divider, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { TwitterPicker } from 'react-color';

export default function PointInfoSidebar() {
    const [name, setName] = useState('Point 1');
    const [dropdownValue, setDropdownValue] = useState('Option 1');
    const [value, setValue] = useState('Value');
    const [size, setSize] = useState(10); 
    const [color, setColor] = useState('#0000ff');
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            <Typography variant="h6" style={{ margin: '10px' }}>Map of the Pacific Ocean</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
            <Typography variant="subtitle1" style={{ margin: '10px', textAlign: 'center' }}>A graphic showing the amount of water in the Pacific Ocean. It's a lot.</Typography>
            <Divider variant='middle' style={{ width: '80%', margin: '10px', marginTop: '80px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
            <Typography variant="h6" style={{ margin: '10px' }}>Point Data</Typography>
            <Box sx={{ p: 0, width: '100%', display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ mr: 1, ml: '10%' }}>Name:</Typography>  
                        <TextField value={name} sx={{ marginLeft: 'auto' }} onChange={e => setName(e.target.value)} />
                        <IconButton disabled={true}>
                        <CheckIcon  sx={{ marginLeft: 'auto', color: 'white' }} />  
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <FormControl sx={{ mr: 1, ml: '10%' }}>
                        <Select value={dropdownValue} onChange={e => setDropdownValue(e.target.value)}>
                            <MenuItem value="Option 1">Option 1</MenuItem>
                            <MenuItem value="Option 2">Option 2</MenuItem>
                        </Select>
                        </FormControl>

                        <TextField value={value} sx={{ marginLeft: 'auto', width: '100px' }} onChange={e => setValue(e.target.value)}/>
                        
                        <IconButton>
                        <DeleteIcon  sx={{ marginLeft: 'auto' }} />  
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ mr: 1, ml: '10%' }}>Size:</Typography>

                        <IconButton sx={{ marginLeft: 'auto'}} onClick={() => setSize(size - 1)}>
                        <RemoveIcon />
                        </IconButton>

                        <TextField value={size} sx={{ marginLeft: 'auto', width: '100px' }} onChange={e => setSize(Number(e.target.value))}/>

                        <IconButton  onClick={() => setSize(size + 1)}>
                        <AddIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>  
                        <Typography sx={{ mr: 1, ml: '10%' }}>Color:</Typography>

                        <Box sx={{ width: 30, height: 30, backgroundColor: color, marginLeft: 'auto' }} onClick={() => setDisplayColorPicker(!displayColorPicker)} />
                        <IconButton disabled={true}>
                        <CheckIcon  sx={{ marginLeft: 'auto', color: 'white' }} />  
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'right', justifyItems: 'right', marginRight: '15%' }}>  
                        {displayColorPicker && (<TwitterPicker color={color} onChangeComplete={color => setColor(color.hex)} sx={{ marginLeft: 'auto'}} triangle='hide'/>)}
                    </Box>

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
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '80%' }}>  
                        <Button 
                            variant="contained"
                            sx={{ color: 'black', mx: 1, marginTop: 'auto', marginBottom: '10px', marginRight: 'auto', backgroundColor: '#CCCCCC' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '135px', minHeight: '20px'}} 
                            disableRipple
                        >
                            Move Point
                        </Button>

                        <Button 
                            variant="contained"
                            sx={{ color: 'white', mx: 1, marginTop: 'auto', marginBottom: '10px', marginLeft: 'auto' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '150px', minHeight: '20px'}} 
                            disableRipple
                            color='razzmatazz'
                        >
                            Delete Point
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}