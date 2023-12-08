import { useState, useContext, useEffect } from 'react';
import { Button, TextField, ClickAwayListener, /* FormControl, Select, MenuItem, */ IconButton, Divider, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
// import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { TwitterPicker } from 'react-color';
import { GlobalStoreContext } from '../store';

export default function PointInfoSidebar({mapData, currentPoint, mapSchema}) {
    const { store } = useContext(GlobalStoreContext);
    const [mapInfo, setMapInfo] = useState(mapSchema);
    const [name, setName] = useState('');
    const [weight, setWeight] = useState(0.5); 
    const [color, setColor] = useState('#000000');
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    
    useEffect(() => {
        const retrieveData = async () => {
            setMapInfo(mapSchema);
            console.log(currentPoint);
            console.log(mapSchema);
            if (currentPoint) {
                const match = mapSchema.points.find(point => point.name === currentPoint.name);
                setName(match.name);
                setWeight(match?.weight ? match.weight : 0.5);
                setColor(match?.color ? match.color : '#DDDDDD');
            }
        }
        retrieveData();
    }, [/* store,  */currentPoint, /* mapData, */ mapSchema]) // eslint-disable-line react-hooks/exhaustive-deps

    const updateSchema = async (updatedSchema, newPoint) => {
        /* const resp =  */await store.updateMapSchema(mapData._id, updatedSchema);
        /* console.log(resp); */
        setMapInfo(updatedSchema);
        const match = updatedSchema.points.find(point => point.name === newPoint.name || point.name === currentPoint.name);
        setName(match.name);
        setWeight(match.weight ? match.weight : 0.5);
        setColor(match.color ? match.color : '#E3256B');
    }

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            {/* Map Info Header */}
            <Typography variant="h6" style={{ margin: '10px' }}>{mapData?.title ? mapData.title : ''}</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
            <Typography variant="subtitle1" style={{ margin: '10px', textAlign: 'center' }}>{mapData?.description ? mapData.description : ''}</Typography>
            <Divider variant='middle' style={{ width: '80%', margin: '10px', marginTop: '80px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />

            {/* Point Data */}
            <Typography variant="h6" style={{ margin: '10px' }}>Point Data</Typography>
            <Box sx={{ p: 0, width: '100%', display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
                    {/* Point Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ mr: 1, ml: '10%' }}>Name</Typography>  
                        <TextField value={name} sx={{ marginLeft: 'auto' }} InputProps={{ sx: { borderRadius: 3 } }} 
                        onChange={e => setName(e.target.value)}
                        onBlur={() => {
                            updateSchema({...mapInfo, points: mapInfo.points.map(point => {
                                return point.name === currentPoint.name
                                ? {...point, name: name} : point;
                            })}, {...currentPoint, name: name})
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
                        onBlur={() => {
                            updateSchema({...mapInfo, points: mapInfo.points.map(point => {
                                return point.name === currentPoint.name
                                ? {...point, weight: Number(weight)} : point;
                            })}, {...currentPoint, name: Number(weight)})
                        }}
                        />

                        <IconButton  onClick={() => {
                            setWeight(weight + 0.1);
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
                            sx={{ color: 'white', mx: 1, marginTop: 'auto', marginBottom: '10px' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '190px', minHeight: '20px'}} 
                            disableRipple
                            color='razzmatazz'
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
                            onClick={() => { 
                                /* console.log(store);  */
                                store.setMapEditMode(/* store.mapEditMode === "AddPoint" ? "None" :  */'AddPoint'); 
                            }}
                        >
                            Add
                        </Button>

                        <Button 
                            variant="contained"
                            sx={{ color: 'black', mx: 1, marginTop: 'auto', marginBottom: '10px', marginRight: 'auto', backgroundColor: '#CCCCCC' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '135px', minHeight: '20px'}} 
                            disableRipple
                            onClick={() => { store.setMapEditMode('MovePoint'); }}
                        >
                            Move
                        </Button>

                        <Button 
                            variant="contained"
                            sx={{ color: 'white', mx: 1, marginTop: 'auto', marginBottom: '10px', marginLeft: 'auto' }} 
                            style={{fontSize:'12pt', maxWidth: '200px', maxHeight: '30px', minWidth: '100px', minHeight: '20px'}} 
                            disableRipple
                            color='razzmatazz'
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}