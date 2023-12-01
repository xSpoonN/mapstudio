import { useEffect, useState, useContext } from 'react';
import { GlobalStoreContext } from '../store';
import { Button, TextField, FormControl, Select, MenuItem, IconButton, Divider, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { TwitterPicker } from 'react-color';

export default function SubdivisionInfoSidebar({ currentFeature }) {
    const { store } = useContext(GlobalStoreContext);
    /* const [sdData, setSdData] = useState({}); */
    const [mapInfo, setMapInfo] = useState({});
    const [name, setName] = useState('');
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [dropdownValue, setDropdownValue] = useState('');
    const [value, setValue] = useState('');
    const [weight, setWeight] = useState(0.5); 
    const [color, setColor] = useState('#E3256B');
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    useEffect(() => {
        const retrieveData = () => {
            const schemaData = store.schemaData;
            console.log(currentFeature);
            if (currentFeature) {
                /* setName(featureData.name); */
                const match = schemaData?.subdivisions.find(subdivision => subdivision.name === currentFeature);
                setName(currentFeature.name);
                if (match) {
                    /* setSdData(match); */
                    const options = Object.getOwnPropertyNames(match.data);
                    setDropdownOptions(options)
                    setDropdownValue(options ? options[0] : '');
                    setValue(options ? match.data[options[0]] : '');
                    setWeight(match.weight ? match.weight : 0.5);
                    setColor(match.color ? match.color : '#E3256B');
                }
            }
            const mapData = store.mapData;
            if (mapData) {
                setMapInfo(mapData);
            }
        }
        retrieveData();
    }, [store])

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            {/* Map Info Header */}
            <Typography variant="h6" style={{ margin: '10px' }}>{mapInfo?.title ? mapInfo.title : ''}</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
            <Typography variant="subtitle1" style={{ margin: '10px', textAlign: 'center' }}>{mapInfo?.description ? mapInfo.description : ''}</Typography>
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
                            {dropdownOptions.map(option => <MenuItem value={option}>{option}</MenuItem>)}
                            {/* <MenuItem value="Option 1">Option 1</MenuItem>
                            <MenuItem value="Option 2">Option 2</MenuItem> */}
                        </Select>
                        </FormControl>

                        <TextField value={value} sx={{ margin: '2px', marginLeft: 'auto', width: '100px' }}
                        inputProps={{style: { textAlign: 'center'}}} InputProps={{ sx: { borderRadius: 3 } }}
                        onChange={e => setValue(e.target.value)}/>
                        
                        <IconButton>
                        <DeleteIcon  sx={{ marginLeft: 'auto' }} />  
                        </IconButton>
                    </Box>

                    {/* Subdivision Weight */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ mr: 1, ml: '10%' }}>Weight</Typography>

                        <IconButton sx={{ marginLeft: 'auto'}} onClick={() => setWeight(weight - 1)}>
                        <RemoveIcon />
                        </IconButton>

                        <TextField value={weight} sx={{ width: '50px', margin: '2px' }} 
                        inputProps={{style: { textAlign: 'center'}}} InputProps={{ sx: { borderRadius: 3 } }}
                        onChange={e => setWeight(Number(e.target.value))}/>

                        <IconButton  onClick={() => setWeight(weight + 1)}>
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
                            style={{fontWeight:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '190px', minHeight: '20px'}} 
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