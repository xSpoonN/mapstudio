import { useEffect, useState, useContext } from 'react';
import { GlobalStoreContext } from '../store';
import { Button, TextField, ClickAwayListener, FormControl, Select, MenuItem, IconButton, Divider, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckIcon from '@mui/icons-material/Check';
import List from '@mui/material/List';
import { TwitterPicker } from 'react-color';
import SubdivisionItem from './SubdivisionItem';
import Property from './SubdivisionProperty';

const SASTOKEN = 'sp=r&st=2023-12-03T19:46:53Z&se=2025-01-09T03:46:53Z&sv=2022-11-02&sr=c&sig=LL0JUIq%2F3ZfOrYW8y4F4lk67ZXHFlGdmY%2BktKsHPkss%3D';

export default function SubdivisionInfoSidebar({ mapData, currentFeature, mapSchema, setFeature }) {
    const { store } = useContext(GlobalStoreContext);
    /* const [sdData, setSdData] = useState({}); */
    const [mapInfo, setMapInfo] = useState(mapSchema);
    const [name, setName] = useState('');
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [dropdownValue, setDropdownValue] = useState('');
    const [value, setValue] = useState('');
    const [weight, setWeight] = useState(0.5); 
    const [color, setColor] = useState('#DDDDDD');
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const [allProperties, setAllProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState('');

    // Handles updating the map schema when something changes elsewhere, and on initial load
    useEffect(() => {
        const retrieveData = async () => {
            setMapInfo(mapSchema);
            if (currentFeature) { // If a subdivision is selected
                // Find the subdivision in the map schema
                const match = mapSchema?.subdivisions?.find(subdivision => // Need to check all possible name fields because of inconsistencies in the geojson data
                    subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                );
                setName(currentFeature.name || currentFeature.NAME || currentFeature.Name);
                if (match) {
                    // Get all unique data fields from subdivisions
                    const dataFieldsSet = new Set();
                    mapSchema?.subdivisions?.forEach(subdivision => {
                        Object.keys(subdivision.data || {}).forEach(key => dataFieldsSet.add(key));
                    })
                    const dataFields = [...dataFieldsSet];
                    const options = allProperties.length ? allProperties : [...(mapSchema.props || []), ...dataFields]; // Get the object properties of the subdivision as an array
                    setDropdownOptions(options)
                    setDropdownValue(options ? options[0] : '');
                    setValue(options ? (match.data ? match.data[options[0]] || 'N/A' : 'N/A') : '');
                } else {
                    setDropdownOptions([]);
                    setDropdownValue('');
                    setValue('');
                }
                setWeight(match?.weight ? match.weight : 0.5);
                setColor(match?.color ? match.color : '#DDDDDD');
            } else {
                if (mapSchema && !mapSchema.subdivisions?.length) { // eslint-disable-line
                    console.log("Fetching");
                    fetch(`${mapData?.mapFile}?${SASTOKEN}`, {mode: "cors"}) // Fetch GeoJSON data
                    .then((response) =>  response.json()) // Parse response as JSON
                    .then((geojson) => {
                        const subdivisions = geojson.features.map(feature => {
                            return {
                                name: feature.properties.NAME || feature.properties.name || feature.properties.Name, 
                                weight: 0.5, 
                                color: '#DDDDDD'
                            }
                        })
                        console.log("subdivisions", subdivisions);
                        updateSchema({...mapSchema, subdivisions: subdivisions});
                    }).catch((error) => {
                        console.error('Error reading GeoJSON', error);
                    });
                }
                // Get all unique data fields from subdivisions
                const dataFieldsSet = new Set();
                mapSchema?.subdivisions?.forEach(subdivision => {
                    Object.keys(subdivision.data || {}).forEach(key => dataFieldsSet.add(key));
                })
                const dataFields = [...dataFieldsSet];
                const combinedData = [...(mapSchema.props || []), ...dataFields];
                const sorted = combinedData.sort((a, b) => a.localeCompare(b));
                setAllProperties(sorted);
                if (sorted && !sorted.includes(selectedProperty)) setSelectedProperty(sorted[0]);
            }
        }
        retrieveData();
    }, [currentFeature, mapSchema]) // eslint-disable-line react-hooks/exhaustive-deps

    // Handles pushing the updated map schema to store
    const updateSchema = async (updatedSchema) => {
        await store.updateMapSchema(mapData._id, updatedSchema);
        setMapInfo(updatedSchema);
        if (currentFeature) { // If a subdivision is selected
            // Find the subdivision in the map schema
            const match = updatedSchema?.subdivisions?.find(subdivision => // Need to check all possible name fields because of inconsistencies in the geojson data
                subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
            );
            setName(currentFeature.name || currentFeature.NAME || currentFeature.Name);
            if (match) {
                setWeight(match.weight ? match.weight : 0.5);
                setColor(match.color ? match.color : '#E3256B');
                if (match) {
                    // Get all unique data fields from subdivisions
                    const dataFieldsSet = new Set();
                    mapSchema?.subdivisions?.forEach(subdivision => {
                        Object.keys(subdivision.data || {}).forEach(key => dataFieldsSet.add(key));
                    })
                    const dataFields = [...dataFieldsSet];
                    const options = allProperties.length ? allProperties : [...(mapSchema.props || []), ...dataFields]; // Get the object properties of the subdivision as an array
                    setDropdownOptions(options)
                    setDropdownValue(options ? options[0] : '');
                    setValue(options ? (match.data ? match.data[options[0]] || 'N/A' : 'N/A') : '');
                } else {
                    setDropdownOptions([]);
                    setDropdownValue('');
                    setValue('');
                }
                setWeight(match.weight ? match.weight : 0.5);
                setColor(match.color ? match.color : '#E3256B');
            }
        } else {
            // Get all unique data fields from subdivisions
            const dataFieldsSet = new Set();
            updatedSchema?.subdivisions?.forEach(subdivision => {
                Object.keys(subdivision.data || {}).forEach(key => dataFieldsSet.add(key));
            })
            const dataFields = [...dataFieldsSet];
            setAllProperties([...(updatedSchema.props || []), ...dataFields]);
        }
    }

    let content = <></>
    if(currentFeature) {
        content = 
            <>
                {/* Subdivision Data */}
                <Typography variant="h6" style={{ margin: '10px' }}>Subdivision Data</Typography>
                <Box sx={{ p: 0, width: '100%', display: 'flex', justifyContent: 'center', height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                        {/* Subdivision Name */}
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Typography sx={{ mr: 1, ml: '10%' }}>Name</Typography>  
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

                                // Find the subdivision in the map schema
                                const existing = mapInfo?.subdivisions?.find(subdivision =>
                                    subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                                );
                                setValue(existing?.data[e.target.value] ? existing.data[e.target.value] : '') // Set the value to the existing value if it exists, otherwise set it to empty string
                            }} sx={{ borderRadius: 3 }}>
                                {dropdownOptions.map(option => <MenuItem value={option}>{option}</MenuItem>)}
                            </Select>
                            </FormControl>

                            <TextField value={value} sx={{ margin: '2px', marginLeft: 'auto', width: '100px' }}
                            inputProps={{style: { textAlign: 'right'}, maxLength: 16}} InputProps={{ sx: { borderRadius: 3 } }}
                            onChange={e => { 
                                setValue(e.target.value); 
                            }}
                            onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                            onBlur={() => {
                                // Find the subdivision in the map schema
                                const existing = mapInfo?.subdivisions?.find(subdivision => 
                                    subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                                );
                                if (existing) { // Technically this should always be true
                                    // Finds the matching subdivision in the data and updates the property's value
                                    updateSchema({...mapInfo, subdivisions: mapInfo.subdivisions.map(subdivision => {
                                        return subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name 
                                        ? {...subdivision, data: {...subdivision.data, [dropdownValue]: value}} : subdivision;
                                    })})
                                } else {
                                    // Adds a new subdivision to the data with the property's value
                                    updateSchema({...mapInfo, 
                                        subdivisions: [...mapInfo.subdivisions, {name: currentFeature.name || currentFeature.NAME || currentFeature.Name, data: {[dropdownValue]: value}}]
                                    })
                                }
                            }}
                            />
                            
                            {/* <IconButton>
                            <DeleteIcon  sx={{ marginLeft: 'auto' }} />  
                            </IconButton> */}
                            {/* Placeholder to take up space for alignment */}
                            <IconButton disabled={true}>
                            <CheckIcon  sx={{ marginLeft: 'auto', color: 'white' }} />  
                            </IconButton>
                        </Box>

                        {/* Subdivision Weight */}
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Typography sx={{ mr: 1, ml: '10%' }}>Weight</Typography>

                            <IconButton sx={{ marginLeft: 'auto'}} onClick={() => {
                                setWeight(weight - 0.1);

                                // Find the subdivision in the map schema
                                const existing = mapInfo?.subdivisions?.find(subdivision => 
                                    subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                                );
                                if (existing) {
                                    // Finds the matching subdivision in the data and updates the weight value
                                    updateSchema({...mapInfo, subdivisions: mapInfo.subdivisions.map(subdivision => {
                                        return subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name 
                                        ? {...subdivision, weight: Number(weight - 0.1)} : subdivision;
                                    })})
                                } else {
                                    // Adds a new subdivision to the data with the weight value
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
                            }}
                            onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                            onBlur={() => {
                                // Find the subdivision in the map schema
                                const existing = mapInfo?.subdivisions?.find(subdivision => 
                                    subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                                );
                                if (existing) {
                                    // Finds the matching subdivision in the data and updates the weight value
                                    updateSchema({...mapInfo, subdivisions: mapInfo.subdivisions.map(subdivision => {
                                        return subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name 
                                        ? {...subdivision, weight: Number(weight)} : subdivision;
                                    })})
                                } else {
                                    // Adds a new subdivision to the data with the weight value
                                    updateSchema({...mapInfo,
                                        subdivisions: [...mapInfo.subdivisions, {name: currentFeature.name || currentFeature.NAME || currentFeature.Name, weight: Number(weight)}]
                                    })
                                }
                            }}
                            />

                            <IconButton  onClick={() => {
                                setWeight(weight + 0.1);

                                // Find the subdivision in the map schema
                                const existing = mapInfo?.subdivisions?.find(subdivision => 
                                    subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                                );
                                if (existing) {
                                    // Finds the matching subdivision in the data and updates the weight value
                                    updateSchema({...mapInfo, subdivisions: mapInfo.subdivisions.map(subdivision => {
                                        return subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name 
                                        ? {...subdivision, weight: Number(weight + 0.1)} : subdivision;
                                    })})
                                } else {
                                    // Adds a new subdivision to the data with the weight value
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
                        {displayColorPicker && 
                            <ClickAwayListener onClickAway={() => setDisplayColorPicker(false)}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'right', justifyItems: 'right', marginRight: '15%' }}>  
                                    <TwitterPicker color={color} onChangeComplete={color => {
                                        setColor(color.hex);

                                        // Find the subdivision in the map schema
                                        const existing = mapInfo?.subdivisions?.find(subdivision => 
                                            subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name
                                        );
                                        if (existing) {
                                            // Finds the matching subdivision in the data and updates the color value
                                            updateSchema({...mapInfo, subdivisions: mapInfo.subdivisions.map(subdivision => {
                                                return subdivision.name === currentFeature.name || subdivision.name === currentFeature.NAME || subdivision.name === currentFeature.Name 
                                                ? {...subdivision, color: color.hex} : subdivision;
                                            })})
                                        } else {
                                            // Adds a new subdivision to the data with the color value
                                            updateSchema({...mapInfo,
                                                subdivisions: [...mapInfo.subdivisions, {name: currentFeature.name || currentFeature.NAME || currentFeature.Name, color: color.hex}]
                                            })
                                        }
                                    }} sx={{ marginLeft: 'auto'}} triangle='hide'/>
                                </Box>
                            </ClickAwayListener>
                        }

                        {/* Add New Property */}
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
                            <Button 
                                variant="contained"
                                sx={{ color: 'white', mx: 1, marginTop: 'auto', marginBottom: '10px' }} 
                                style={{fontWeight:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '190px', minHeight: '20px'}} 
                                disableRipple
                                color='razzmatazz'
                                onClick={() => setFeature(undefined)}
                            >
                                Add New Property
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </>
    } else {
        content = 
            <>
                <Typography variant="h6" style={{ margin: '10px' }}>Properties</Typography>
                <List sx={{ width: '90%' }}>
                    {/* Property List */}
                    {allProperties.map((p, index) => (
                        <Property key={index} propName={p} mapSchema={mapSchema} mapData={mapData}/>
                    ))}
                </List>
                {/* Add New Property */}
                <Button 
                    variant="text"
                    sx={{ color: 'black', marginTop: 'auto', marginBottom: '10px', marginLeft: 'auto' }} 
                    style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '190px', minHeight: '20px'}} 
                    disableRipple
                    color='razzmatazz'
                    onClick={async () => {
                        const maxExistingNum = (mapSchema.props || []).reduce((max, str) => {
                            const match = str.match(/^New Property(?: \d+)?$/);
                            if (match) {
                                const num = Number(str.split(' ')[2]);
                                return num > max ? num : max;
                            } else {
                                return max;
                            }
                        }, 0);
                        const newNum = /* maxExistingNum ?  */` ${maxExistingNum + 1}`/*  : ''; */
                        await updateSchema({
                            ...mapSchema, 
                            props: [...(mapSchema.props || []), `New Property${newNum}`]
                        });
                    }}
                >
                    + New Property
                </Button>
                <Divider variant='middle' style={{ width: '80%', margin: '10px', marginTop: '20px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
                <Typography variant="h6" style={{ margin: '10px' }}>All Subdivisions</Typography>
                <Select value={selectedProperty} onChange={e => {
                        setSelectedProperty(e.target.value);
                    }} 
                    sx={{ borderRadius: 3, marginLeft: 'auto', marginRight: '10%' }} 
                    onClick={e => e.stopPropagation()}>
                    {allProperties.map(option => <MenuItem value={option}>{option}</MenuItem>)}
                </Select>
                <List sx={{ width: '90%' }}>
                    {mapSchema?.subdivisions.sort((a, b) => a.name.localeCompare(b.name))
                    .map((sub) => (
                        <>
                            <SubdivisionItem sub={sub} allProperties={allProperties} mapId={mapData?._id} mapSchema={mapSchema} chosenProp={selectedProperty} setFeature={setFeature}/>
                            <Divider variant='middle' style={{ width: '90%', margin: '5px', backgroundColor: '#dddddd', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
                        </>
                    ))}
                </List>
            </>
    }


    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
        {/* Map Info Header */}
        <Typography variant="h6" style={{ margin: '10px' }}>{mapData?.title ? mapData.title : ''}</Typography>
        <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
        <Typography variant="subtitle1" style={{ margin: '10px', textAlign: 'center' }}>{mapData?.description ? mapData.description : ''}</Typography>
        <Divider variant='middle' style={{ width: '80%', margin: '10px', marginTop: '80px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
        {content}
        </Box>
    );
}