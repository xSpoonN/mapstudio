import { useState, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import { Box, /* Typography, */ IconButton, TextField, ClickAwayListener } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { TwitterPicker } from 'react-color';

export default function Bin({bin, mapSchema, mapData, setMapEditMode}) {
    const [name, setName] = useState(bin?.name);
    const [color, setColor] = useState(bin?.color);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        const retrieveData = async () => {
            /* console.log(currentPoint);
            console.log(mapSchema); */
            if (bin) {
                const match = mapSchema.bins.find(bin2 => bin2.name === bin.name);
                setName(match.name);
                setColor(match?.color ? match.color : '#000000');
            }
        }
        retrieveData();
    }, [/* store,  */bin, /* mapData, */ mapSchema]) // eslint-disable-line react-hooks/exhaustive-deps
    const updateSchema = async (updatedSchema) => {
        /* const resp =  */await store.updateMapSchema(mapData._id, updatedSchema);
        /* console.log(resp); */
        /* setMapInfo(updatedSchema); */
        console.log(updatedSchema)
        const match = updatedSchema?.bins?.find(bin2 => bin2.name === name );
        
        if (match) {
            setName(match.name);
            setColor(match.color ? match.color : '#E3256B');
        }
    }
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {/* Add/Remove from Bin */}
                <IconButton sx={{ ml: '5%', padding: 0.25 }}
                    onClick={() => {
                        setMapEditMode(`AddToBin-${bin.name}`);
                    }}
                >
                    <AddIcon />
                    {/* <RemoveIcon /> */}
                </IconButton>
                <IconButton sx={{ padding: 0.25 }}
                    onClick={() => {
                        setMapEditMode(`DeleteFromBin-${bin.name}`);
                    }}
                >
                    <RemoveIcon />
                </IconButton>

                {/* Bin Color */}
                <Box sx={{ width: 30, height: 30, backgroundColor: color, borderRadius: '5px', marginLeft: '5px', marginRight: '2px' }} onClick={() => setDisplayColorPicker(!displayColorPicker)} />
                {/* <Typography>Bin</Typography> */}
                
                {/* Bin Name */}
                <TextField value={name} sx={{ marginLeft: 'auto', maxWidth: '200px' }} InputProps={{ sx: { borderRadius: 3 } }} 
                    onChange={e => setName(e.target.value)} 
                    onBlur={async () => {
                        const nameExists = mapSchema.bins.some(bin2 => bin2.name === name);
                        if (!nameExists) {
                            await updateSchema({...mapSchema, bins: mapSchema.bins.map(bin2 => bin2.name === bin.name ? {...bin2, name: name} : bin2)});
                        } else {
                            setName(bin.name);
                            console.log('Name already exists');
                        }
                    }}
                />

                {/* Delete Bin */}
                <IconButton 
                    onClick={() => {
                        console.log('removing ', bin.name);
                        console.log('from ', mapSchema.bins);
                        const newSubdivisions = mapSchema.subdivisions.map(subdivision => {
                            return bin.subdivisions?.includes(subdivision.name) ? {...subdivision, color: '#DDDDDD', weight: 0.5} : subdivision;
                        });
                        updateSchema({...mapSchema, subdivisions: newSubdivisions, bins: mapSchema.bins.filter(bin2 => bin2.name !== bin.name)});
                    }}
                >
                <DeleteIcon  sx={{ marginLeft: 'auto' }} />  
                </IconButton>
            </Box>
            
            {displayColorPicker && 
                <ClickAwayListener onClickAway={() => setDisplayColorPicker(false)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'right', justifyItems: 'right', marginRight: '15%' }}>  
                        <TwitterPicker color={color} onChangeComplete={color => {
                            setColor(color.hex);
                            const newSubdivisions = mapSchema.subdivisions.map(subdivision => {
                                return bin.subdivisions?.includes(subdivision.name) ? {...subdivision, color: color.hex, weight: 0.5} : subdivision;
                            });
                            updateSchema({...mapSchema, subdivisions: newSubdivisions, bins: mapSchema.bins.map(bin2 => {
                                return bin2.name === bin.name 
                                ? {...bin2, color: color.hex} : bin2;
                            })}, {...bin, name: color.hex})
                        }} 
                        sx={{ marginLeft: 'auto'}} triangle='hide'/>
                    </Box>
                </ClickAwayListener>
            }
        </>
    )
}