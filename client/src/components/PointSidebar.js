import { useState, useContext, useEffect } from 'react';
import { Button, TextField, ClickAwayListener, /* FormControl, Select, MenuItem, */ IconButton, Divider, Box, Typography, ListItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
// import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import { TwitterPicker } from 'react-color';
import { GlobalStoreContext } from '../store';

export default function PointInfoSidebar({mapData, currentPoint, mapSchema, setMapEditMode, setCurrentPoint, panToPoint}) {
    const { store } = useContext(GlobalStoreContext);
    const [mapInfo, setMapInfo] = useState(mapSchema);
    const [name, setName] = useState('');
    const [lat, setLat] = useState(0)
    const [lon, setLon] = useState(0)
    const [weight, setWeight] = useState(0.5); 
    const [color, setColor] = useState('#000000');
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    // Handles updating the map schema when something changes elsewhere, and on initial load
    useEffect(() => {
        const retrieveData = async () => {
            setMapInfo(mapSchema);
            if (currentPoint) {
                const match = mapSchema.points.find(point => point.name === currentPoint.name);
                setName(match.name);
                setLat(match.location.lat)
                setLon(match.location.lon)
                setWeight(match?.weight ? match.weight : 0.5);
                setColor(match?.color ? match.color : '#000000');
            }
        }
        retrieveData();
    }, [currentPoint, mapSchema]) // eslint-disable-line react-hooks/exhaustive-deps

    // Handles pushing the updated map schema to store
    const updateSchema = async (updatedSchema, newPoint, param) => {
        await store.updateMapSchema(mapData._id, updatedSchema);
        setMapInfo(updatedSchema);
        if (!newPoint) { // If there is no newPoint data, then reset to default since we are deleting the point
            setName('');
            setWeight(0.5);
            setColor('#000000');
            return;
        }
        if (param === "name") currentPoint.name = newPoint.name // If we are updating the name, then update the currentPoint data to match
        if (param === "lat") currentPoint.location.lat = newPoint.location.lat
        if (param === "lon") currentPoint.location.lon = newPoint.location.lon
        const match = updatedSchema.points.find(point => point.name === newPoint.name || point.name === currentPoint.name);
        setName(match.name);
        setWeight(match.weight ? match.weight : 0.5);
        setColor(match.color ? match.color : '#000000');
    }

    let content = <></>
    if(currentPoint) {
        content = 
            <>
            {/* Point Data */}
            <Typography variant="h6" style={{ margin: '10px' }}>Point Data</Typography>
            <Box sx={{ p: 0, width: '100%', display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                    {/* Point Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ mr: 1, ml: '10%' }}>Name</Typography>  
                        <TextField value={name} sx={{ marginLeft: 'auto' }} InputProps={{ sx: { borderRadius: 3 } }} inputProps={{ maxLength: 50 }}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                        onBlur={() => {
                            const isNameExists = mapInfo.points.some(point => point.name === name); // Checks if the name already exists
                            if (isNameExists) {
                                // Handle the case when the name already exists
                                console.log('Name already exists');
                                return setName(currentPoint.name);
                            }
                            // Finds the point in the mapInfo and updates it with the new name
                            updateSchema({...mapInfo, points: mapInfo.points.map(point => {
                                return point.name === currentPoint.name
                                ? {...point, name: name} : point;
                            })}, {...currentPoint, name: name}, "name");
                        }}
                        />

                        {/* Placeholder to take up space for alignment */}
                        <IconButton disabled={true}>
                        <CheckIcon  sx={{ marginLeft: 'auto', color: 'white' }} />  
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ mr: 1, ml: '10%' }}>Lat/Lon</Typography>  
                        <TextField value={lat} sx={{ marginLeft: 'auto', width: '20%' }} InputProps={{ sx: { borderRadius: 3 } }} 
                        onChange={e => setLat(Number(e.target.value))}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                        onBlur={() => {
                            // Finds the point in the mapInfo and updates it with the new lat
                            updateSchema({...mapInfo, points: mapInfo.points.map(point => {
                                return point.name === currentPoint.name 
                                ? {...point, location: {lat: lat, lon: lon}} : point;
                            })}, {...currentPoint, location: {lat: lat, lon: lon}}, "lat")
                            panToPoint(lat, lon)
                        }}
                        />

                        <TextField value={lon} sx={{ width: '20%' }} InputProps={{ sx: { borderRadius: 3 } }} 
                        onChange={e => setLon(Number(e.target.value))}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                        onBlur={() => {
                            // Finds the point in the mapInfo and updates it with the new lon
                            updateSchema({...mapInfo, points: mapInfo.points.map(point => {
                                return point.name === currentPoint.name 
                                ? {...point, location: {lat: lat, lon: lon}} : point;
                            })}, {...currentPoint, location: {lat: lat, lon: lon}}, "lon")
                            panToPoint(lat, lon)
                        }}
                        />

                        {/* Placeholder to take up space for alignment */}
                        <IconButton disabled={true}>
                        <CheckIcon  sx={{ marginLeft: 'auto', color: 'white' }} />  
                        </IconButton>
                    </Box>

                    {/* Point Size */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ mr: 1, ml: '10%' }}>Size</Typography>


                        <IconButton sx={{ marginLeft: 'auto'}} onClick={() => {
                            setWeight(weight - 0.1);

                            // Finds the point in the mapInfo and updates it with the new weight
                            updateSchema({...mapInfo, points: mapInfo.points.map(point => {
                                return point.name === currentPoint.name 
                                ? {...point, weight: Number(weight - 0.1)} : point;
                            })}, {...currentPoint, name: Number(weight - 0.1)})
                        }}>
                        <RemoveIcon />
                        </IconButton>

                        <TextField value={weight.toFixed(2)} sx={{ width: '100px', margin: '2px' }} 
                        inputProps={{style: { textAlign: 'center'}}} InputProps={{ sx: { borderRadius: 3 } }}
                        onChange={e => setWeight(Number(e.target.value))}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                        onBlur={() => {
                            // Finds the point in the mapInfo and updates it with the new weight
                            updateSchema({...mapInfo, points: mapInfo.points.map(point => {
                                return point.name === currentPoint.name
                                ? {...point, weight: Number(weight)} : point;
                            })}, {...currentPoint, name: Number(weight)})
                        }}
                        />

                        <IconButton  onClick={() => {
                            setWeight(weight + 0.1);

                            // Finds the point in the mapInfo and updates it with the new weight
                            updateSchema({...mapInfo, points: mapInfo.points.map(point => {
                                return point.name === currentPoint.name 
                                ? {...point, weight: Number(weight + 0.1)} : point;
                            })}, {...currentPoint, name: Number(weight + 0.1)})
                        }}>
                        <AddIcon />
                        </IconButton>
                    </Box>

                    {/* Point Color */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>  
                        <Typography sx={{ mr: 1, ml: '10%' }}>Color</Typography>
                        <Box sx={{ width: 30, height: 30, borderRadius: '5px', backgroundColor: color, marginLeft: 'auto' }} onClick={() => setDisplayColorPicker(!displayColorPicker)} />

                        {/* Placeholder to take up space for alignment */}
                        <IconButton disabled={true}>
                        <CheckIcon  sx={{ marginLeft: 'auto', color: 'white' }} />  
                        </IconButton>
                    </Box>

                    {/* Color Picker */}
                    {displayColorPicker && 
                        <ClickAwayListener onClickAway={() => setDisplayColorPicker(false)}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'right', justifyItems: 'right', marginRight: '15%' }}>  
                                <TwitterPicker color={color} onChangeComplete={color => {
                                    setColor(color.hex);

                                    // Finds the point in the mapInfo and updates it with the new color
                                    updateSchema({...mapInfo, points: mapInfo.points.map(point => {
                                        return point.name === currentPoint.name 
                                        ? {...point, color: color.hex} : point;
                                    })}, {...currentPoint, name: color.hex})
                                }} 
                                sx={{ marginLeft: 'auto'}} triangle='hide'/>
                            </Box>
                        </ClickAwayListener>
                    }

                    {/* Add New Property */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
                        <Button 
                            variant="contained"
                            sx={{ color: 'white', mx: 1, marginTop: 'auto', marginBottom: '10px', marginLeft: 'auto', marginRight: 'auto' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '190px', minHeight: '20px'}} 
                            disableRipple
                            color='razzmatazz'
                            onClick={() => setCurrentPoint(undefined)}
                        >
                            Add New Property
                        </Button>
                    </Box>
                    
                    {/* Move/Delete Point */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '80%' }}>  
                        <Button 
                            variant="contained"
                            sx={{ color: 'white', mx: 1, marginTop: 'auto', marginBottom: '10px', marginLeft: 'auto' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '100px', minHeight: '20px'}} 
                            disableRipple
                            color='razzmatazz'
                            onClick={() => { setMapEditMode('AddPoint'); }}
                        >
                            Add
                        </Button>

                        <Button 
                            variant="contained"
                            sx={{ color: 'black', mx: 1, marginTop: 'auto', marginBottom: '10px', marginRight: 'auto', marginLeft: 'auto', backgroundColor: '#CCCCCC' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '100px', minHeight: '20px'}} 
                            disableRipple
                            onClick={() => { setMapEditMode('MovePoint'); }}
                        >
                            Move
                        </Button>

                        <Button 
                            variant="contained"
                            sx={{ color: 'white', mx: 1, marginTop: 'auto', marginBottom: '10px', marginLeft: 'auto' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '100px', minHeight: '20px'}} 
                            disableRipple
                            color='razzmatazz'
                            onClick={() => { 
                                // Deletse the point from the mapInfo
                                updateSchema({...mapInfo, points: mapInfo.points.filter(point => point.name !== currentPoint.name)}, null);
                                setMapEditMode('DeletePoint');
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Box>
            </>
    } else {
        content = 
            <>
                <Typography variant="h6" style={{ margin: '10px' }}>All Points</Typography>
                <List sx={{ width: '90%' }}>
                    {mapInfo?.points?.sort((a, b) => a.name.localeCompare(b.name))
                    .map((point) => (
                        <>
                            <ListItem onClick={() => {setCurrentPoint(point); panToPoint(point?.location.lat, point?.location.lon)}}>
                                <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography variant="h6">{point.name}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{point?.location?.lat.toFixed(2)}, {point?.location?.lon.toFixed(2)}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>Weight: {point?.weight.toFixed(2)}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Box sx={{ width: 30, height: 30, borderRadius: '5px', backgroundColor: point.color ? point.color : "#000000", marginLeft: 'auto' }} />
                                </Grid>
                                </Grid>
                            </ListItem>
                            <Divider variant='middle' style={{ width: '100%', margin: '5px', backgroundColor: '#dddddd', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
                        </>
                    ))}
                </List>
                <Box sx={{ display: 'flex', width: '80%', justifyContent: 'center', mt: 2 }}>  
                        <Button 
                            variant="contained"
                            sx={{ color: 'white', mb: 2 }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '100px', minHeight: '20px'}} 
                            disableRipple
                            color='razzmatazz'
                            onClick={() => { 
                                setMapEditMode('AddPoint'); 
                            }}
                        >
                            Add
                        </Button>
                </Box>
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