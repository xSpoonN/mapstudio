import { useState } from 'react';
import { Button, TextField, FormControl, Select, MenuItem, IconButton, Divider, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { TwitterPicker } from 'react-color';
import Bin from './BinItem';

export default function BinInfoSidebar() {
    const [value, setValue] = useState('Rome');
    const [color, setColor] = useState('#E3256B');
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            <Typography variant="h6" style={{ margin: '10px' }}>Map of the Pacific Ocean</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
            <Typography variant="subtitle1" style={{ margin: '10px', textAlign: 'center' }}>A graphic showing the amount of water in the Pacific Ocean. It's a lot.</Typography>
            <Divider variant='middle' style={{ width: '80%', margin: '10px', marginTop: '80px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />

            <Typography variant="h6" style={{ margin: '10px' }}>Bin Data</Typography>
            <Box sx={{ p: 0, width: '100%', display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>  
                        <Button 
                            variant="text"
                            sx={{ color: 'black', marginTop: 'auto', marginBottom: '10px', marginLeft: 'auto' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '190px', minHeight: '20px'}} 
                            disableRipple
                            color='razzmatazz'
                        >
                            + New Bin
                        </Button>
                        <IconButton disabled={true}>
                        <CheckIcon  sx={{ marginLeft: 'auto', color: 'white' }} />  
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}