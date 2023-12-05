import { useEffect, useState, useContext } from 'react';
import { GlobalStoreContext } from '../store';
import { Button, TextField, FormControl, Select, MenuItem, IconButton, Divider, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { TwitterPicker } from 'react-color';

export default function SubdivisionInfoSidebar({ mapData, currentFeature, mapSchema }) {
    const { store } = useContext(GlobalStoreContext);
    /* const [sdData, setSdData] = useState({}); */
    const [mapInfo, setMapInfo] = useState(mapSchema); // eslint-disable-line
    const [name, setName] = useState('');
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [dropdownValue, setDropdownValue] = useState('');
    const [value, setValue] = useState('');
    const [weight, setWeight] = useState(0.5); 
    const [color, setColor] = useState('#DDDDDD');
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    useEffect(() => {
        const retrieveData = async () => {
            setMapInfo(mapSchema);
            console.log(currentFeature);
            console.log(mapSchema);
            if (currentFeature) {
                const match = mapSchema?.subdivisions?.find(subdivision => 
                    subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                );
                console.log(match)
                setName(currentFeature.name || currentFeature.NAME || currentFeature.Name);
                if (match?.data) {
                    const options = Object.getOwnPropertyNames(match.data);
                    setDropdownOptions(options)
                    setDropdownValue(options ? options[0] : '');
                    setValue(options ? match.data[options[0]] : '');
                } else {
                    setDropdownOptions([]);
                    setDropdownValue('');
                    setValue('');
                }
                setWeight(match?.weight ? match.weight : 0.5);
                setColor(match?.color ? match.color : '#DDDDDD');
            }
        }
        retrieveData();
    }, [store, currentFeature, mapData, mapSchema]) // eslint-disable-line react-hooks/exhaustive-deps

    const updateSchema = async (updatedSchema) => {
        const resp = await store.updateMapSchema(mapData._id, updatedSchema);
        console.log(resp);
        setMapInfo(updatedSchema);
        const match = updatedSchema?.subdivisions?.find(subdivision => 
            subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
        );
        setName(currentFeature.name || currentFeature.NAME || currentFeature.Name);
        if (match) {
            setWeight(match.weight ? match.weight : 0.5);
            setColor(match.color ? match.color : '#E3256B');
            if (match.data) {
                const options = Object.getOwnPropertyNames(match.data);
                setDropdownOptions(options)
                setDropdownValue(options ? options[0] : '');
                setValue(options ? match.data[options[0]] : '');
            } else {
                setDropdownOptions([]);
                setDropdownValue('');
                setValue('');
            }
            setWeight(match.weight ? match.weight : 0.5);
            setColor(match.color ? match.color : '#E3256B');
        }
    }


    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            {/* Map Info Header */}
            <Typography variant="h6" style={{ margin: '10px' }}>{mapData?.title ? mapData.title : ''}</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
            <Typography variant="subtitle1" style={{ margin: '10px', textAlign: 'center' }}>{mapData?.description ? mapData.description : ''}</Typography>
            <Divider variant='middle' style={{ width: '80%', margin: '10px', marginTop: '80px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />

            {/* Subdivision Data */}
            <Typography variant="h6" style={{ margin: '10px' }}>Subdivision Data</Typography>
            <Box sx={{ p: 0, width: '100%', display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                    {/* Subdivision Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ mr: 1, ml: '10%' }}>Name</Typography>  
                        {/* <TextField value={name} sx={{ marginLeft: 'auto' }} InputProps={{ sx: { borderRadius: 3 } }} 
                        onChange={e => {
                            setName(e.target.value); 
                            updateSchema({...mapInfo, subdivisions: mapInfo.subdivisions.map(subdivision => {
                                if (subdivision.name === currentFeature) { // NAME NAME NAME HAHAHAHHAHA
                                    return {...subdivision, name: e.target.value}
                                } else {
                                    return subdivision;
                                }
                            })})
                        }} 
                        /> */}
                        <Typography sx={{ marginLeft: 'auto', borderRadius: 3, marginRight: '5px' }}>{name}</Typography>

                        {/* Placeholder to take up space for alignment */}
                        <IconButton disabled={true}>
                        <CheckIcon  sx={{ marginLeft: 'auto', color: 'white' }} />  
                        </IconButton>
                    </Box>

                    {/* Subdivision Properties */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <FormControl sx={{ mr: 1, ml: '10%' }}>
                        <Select value={dropdownValue} onChange={e => {
                            setDropdownValue(e.target.value);
                            const existing = mapInfo?.subdivisions?.find(subdivision =>
                                subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                            );
                            console.log("existing", existing);
                            setValue(existing?.data[e.target.value] ? existing.data[e.target.value] : '')
                        }} sx={{ borderRadius: 3 }}>
                            {dropdownOptions.map(option => <MenuItem value={option}>{option}</MenuItem>)}
                            {/* <MenuItem value="Option 1">Option 1</MenuItem>
                            <MenuItem value="Option 2">Option 2</MenuItem> */}
                        </Select>
                        </FormControl>

                        <TextField value={value} sx={{ margin: '2px', marginLeft: 'auto', width: '100px' }}
                        inputProps={{style: { textAlign: 'center'}}} InputProps={{ sx: { borderRadius: 3 } }}
                        onChange={e => { 
                            setValue(e.target.value); 
                            /* const existing = mapInfo?.subdivisions?.find(subdivision => 
                                subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                            );
                            console.log("existing", existing);
                            if (existing) { // Technically this should always be true
                                updateSchema({...mapInfo, subdivisions: mapInfo.subdivisions.map(subdivision => {
                                    return subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name 
                                    ? {...subdivision, data: {...subdivision.data, [dropdownValue]: e.target.value}} : subdivision;
                                })})
                            } else {
                                updateSchema({...mapInfo, 
                                    subdivisions: [...mapInfo.subdivisions, {name: currentFeature.name || currentFeature.NAME || currentFeature.Name, data: {[dropdownValue]: e.target.value}}]
                                })
                            } */
                        }}
                        onBlur={() => {
                            const existing = mapInfo?.subdivisions?.find(subdivision => 
                                subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                            );
                            console.log("existing", existing);
                            if (existing) { // Technically this should always be true
                                updateSchema({...mapInfo, subdivisions: mapInfo.subdivisions.map(subdivision => {
                                    return subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name 
                                    ? {...subdivision, data: {...subdivision.data, [dropdownValue]: value}} : subdivision;
                                })})
                            } else {
                                updateSchema({...mapInfo, 
                                    subdivisions: [...mapInfo.subdivisions, {name: currentFeature.name || currentFeature.NAME || currentFeature.Name, data: {[dropdownValue]: value}}]
                                })
                            }
                        }}
                        />
                        
                        <IconButton>
                        <DeleteIcon  sx={{ marginLeft: 'auto' }} />  
                        </IconButton>
                    </Box>

                    {/* Subdivision Weight */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ mr: 1, ml: '10%' }}>Weight</Typography>

                        <IconButton sx={{ marginLeft: 'auto'}} onClick={() => {
                            setWeight(weight - 0.1);
                            const existing = mapInfo?.subdivisions?.find(subdivision => 
                                subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                            );
                            console.log("existing", existing);
                            if (existing) {
                                updateSchema({...mapInfo, subdivisions: mapInfo.subdivisions.map(subdivision => {
                                    return subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name 
                                    ? {...subdivision, weight: Number(weight - 0.1)} : subdivision;
                                })})
                            } else {
                                updateSchema({...mapInfo, 
                                    subdivisions: [...mapInfo.subdivisions, {name: currentFeature.name || currentFeature.NAME || currentFeature.Name, weight: Number(weight - 0.1)}]
                                })
                            }
                        }}>
                        <RemoveIcon />
                        </IconButton>

                        <TextField value={weight.toFixed(2)} sx={{ width: '70px', margin: '2px' }} 
                        inputProps={{style: { textAlign: 'center'}}} InputProps={{ sx: { borderRadius: 3 } }}
                        onChange={e => {
                            setWeight(e.target.value);
                            /* const existing = mapInfo?.subdivisions?.find(subdivision => 
                                subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                            );
                            console.log("existing", existing);
                            if (existing) {
                                updateSchema({...mapInfo, subdivisions: mapInfo.subdivisions.map(subdivision => {
                                    return subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name 
                                    ? {...subdivision, weight: Number(e.target.value)} : subdivision;
                                })})
                            } else {
                                updateSchema({...mapInfo,
                                    subdivisions: [...mapInfo.subdivisions, {name: currentFeature.name || currentFeature.NAME || currentFeature.Name, weight: Number(e.target.value)}]
                                })
                            } */
                        }}
                        onBlur={() => {
                            const existing = mapInfo?.subdivisions?.find(subdivision => 
                                subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                            );
                            console.log("existing", existing);
                            if (existing) {
                                updateSchema({...mapInfo, subdivisions: mapInfo.subdivisions.map(subdivision => {
                                    return subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name 
                                    ? {...subdivision, weight: Number(weight)} : subdivision;
                                })})
                            } else {
                                updateSchema({...mapInfo,
                                    subdivisions: [...mapInfo.subdivisions, {name: currentFeature.name || currentFeature.NAME || currentFeature.Name, weight: Number(weight)}]
                                })
                            }
                        }}
                        />

                        <IconButton  onClick={() => {
                            setWeight(weight + 0.1);
                            const existing = mapInfo?.subdivisions?.find(subdivision => 
                                subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                            );
                            console.log("existing", existing);
                            if (existing) {
                                updateSchema({...mapInfo, subdivisions: mapInfo.subdivisions.map(subdivision => {
                                    return subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name 
                                    ? {...subdivision, weight: Number(weight + 0.1)} : subdivision;
                                })})
                            } else {
                                updateSchema({...mapInfo, 
                                    subdivisions: [...mapInfo.subdivisions, {name: currentFeature.name || currentFeature.NAME || currentFeature.Name, weight: Number(weight + 0.1)}]
                                })
                            }
                        }}>
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
                        {displayColorPicker && (<TwitterPicker color={color} onChangeComplete={color => {
                            setColor(color.hex);
                            const existing = mapInfo?.subdivisions?.find(subdivision => 
                                subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                            );
                            console.log("existing", existing);
                            if (existing) {
                                updateSchema({...mapInfo, subdivisions: mapInfo.subdivisions.map(subdivision => {
                                    return subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name 
                                    ? {...subdivision, color: color.hex} : subdivision;
                                })})
                            } else {
                                updateSchema({...mapInfo,
                                    subdivisions: [...mapInfo.subdivisions, {name: currentFeature.name || currentFeature.NAME || currentFeature.Name, color: color.hex}]
                                })
                            }
                        }} sx={{ marginLeft: 'auto'}} triangle='hide'/>)}
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