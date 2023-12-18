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

    // Handles updating the bin data when something changes elsewhere, and on initial load
    useEffect(() => {
        const retrieveData = async () => {
            if (bin) {
                const match = mapSchema.bins.find(bin2 => bin2.name === bin.name);
                setName(match.name);
                setColor(match?.color ? match.color : '#000000');
            }
        }
        retrieveData();
    }, [bin, mapSchema]) // eslint-disable-line react-hooks/exhaustive-deps

    // Handles pushing the updated map schema to store
    const updateSchema = async (updatedSchema) => {
        await store.updateMapSchema(mapData._id, updatedSchema);
        console.log(updatedSchema)
        const match = updatedSchema?.bins?.find(bin2 => bin2.name === name ); // Find the bin that was just updated
        if (match) { // If it exists, update the current name and color
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
                
                {/* Bin Name */}
                <TextField value={name} sx={{ marginLeft: 'auto', maxWidth: '200px' }} 
                inputProps={{style: { textAlign: 'right'}, maxLength: 30}} 
                InputProps={{ sx: { borderRadius: 3 } }} 
                    onChange={e => setName(e.target.value)} 
                    onBlur={async () => {
                        const nameExists = mapSchema.bins.some(bin2 => bin2.name === name); // Check if the name already exists
                        if (!nameExists) { // If it doesn't, update the schema
                            await updateSchema({...mapSchema, bins: mapSchema.bins.map(bin2 => bin2.name === bin.name ? {...bin2, name: name} : bin2)});
                        } else { // If it does, reset the name
                            setName(bin.name);
                            console.log('Name already exists');
                        }
                    }}
                />

                {/* Delete Bin */}
                <IconButton 
                    onClick={() => {
                        // Finds any subdivisions that were in the bin, and resets their color and weight
                        const newSubdivisions = mapSchema.subdivisions.map(subdivision => {
                            return bin.subdivisions?.includes(subdivision.name) ? {...subdivision, color: '#DDDDDD', weight: 0.5} : subdivision;
                        });

                        // Updates the schema to remove the bin
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

                            // Finds any subdivisions that are in the bin, and updates their color and weight
                            const newSubdivisions = mapSchema.subdivisions.map(subdivision => {
                                return bin.subdivisions?.includes(subdivision.name) ? {...subdivision, color: color.hex, weight: 0.5} : subdivision;
                            });

                            // Updates the schema to update the bin color
                            updateSchema({...mapSchema, subdivisions: newSubdivisions, bins: mapSchema.bins.map(bin2 => {
                                return bin2.name === bin.name 
                                ? {...bin2, color: color.hex} : bin2;
                            })})
                        }} 
                        sx={{ marginLeft: 'auto'}} triangle='hide'/>
                    </Box>
                </ClickAwayListener>
            }
        </>
    )
}