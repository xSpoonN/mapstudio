import { useState, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import { Box, ClickAwayListener, Select, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { TwitterPicker } from 'react-color';

export default function Gradient({gradient, mapSchema, mapData, setMapEditMode}) {
    const [name, setName] = useState(gradient?.dataField);
    const [color, setColor] = useState(gradient?.minColor);
    const [color2, setColor2] = useState(gradient?.maxColor);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [displayColorPicker2, setDisplayColorPicker2] = useState(false);
    const [valueOptions, setValueOptions] = useState([]);
    const { store } = useContext(GlobalStoreContext);

    // Handles updating the bin data when something changes elsewhere, and on initial load
    useEffect(() => {
        const retrieveData = async () => {
            if (gradient) {
                const match = mapSchema.gradients.find(grd => grd.dataField === gradient.dataField);
                setName(match.dataField);
                setColor(match?.minColor || '#000000');
                setColor2(match?.maxColor || '#000000');

                // Get all unique data fields from subdivisions
                const dataFieldsSet = new Set();
                mapSchema?.subdivisions?.forEach(subdivision => {
                    Object.keys(subdivision.data || {}).forEach(key => dataFieldsSet.add(key));
                })
                const dataFields = [...dataFieldsSet];

                // Find data fields with no gradients yet
                let unusedKeys = [];
                for (const key of dataFields) {
                    if (!mapSchema.gradients.some(gradient => gradient.dataField === key)) {
                        unusedKeys.push(key);
                        break;
                    }
                }
                unusedKeys.push(match.dataField)
                setValueOptions(unusedKeys.map(key => ({value: key, label: key})));
            }
        }
        retrieveData();
    }, [gradient, mapSchema]) // eslint-disable-line react-hooks/exhaustive-deps

    // Handles pushing the updated map schema to store
    const updateSchema = async (updatedSchema) => {
        await store.updateMapSchema(mapData._id, updatedSchema);
        console.log(updatedSchema)
        const match = updatedSchema?.gradients?.find(grd => grd.dataField === name); // Find the gradient that was just updated
        if (match) { // If it exists, update the current name and color
            setName(match.dataField);
            setColor(match?.minColor || '#000000');
            setColor2(match?.maxColor || '#000000');
        }
    }
    
    // Function to interpolate color based on the relative position of a value within a range
    function interpolateColor(value, min, max, minColor, maxColor) {
        const normalizedValue = (value - min) / (max - min);
        const r = Math.round((1 - normalizedValue) * parseInt(minColor.slice(1, 3), 16) + normalizedValue * parseInt(maxColor.slice(1, 3), 16));
        const g = Math.round((1 - normalizedValue) * parseInt(minColor.slice(3, 5), 16) + normalizedValue * parseInt(maxColor.slice(3, 5), 16));
        const b = Math.round((1 - normalizedValue) * parseInt(minColor.slice(5, 7), 16) + normalizedValue * parseInt(maxColor.slice(5, 7), 16));

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    function getKeySubdivisions() {
        // Find subdivisions that have the data field
        const keySubdivisions = mapSchema.subdivisions.filter(subdivision => Object.keys(subdivision.data || {}).includes(name));
        let maxValue = -Infinity; let minValue = Infinity;

        // Find the max and min values for the data field
        keySubdivisions.forEach(subdivision => {
            const value = subdivision.data[name];
            if (value > maxValue) maxValue = value;
            if (value < minValue) minValue = value;
        });

        return {keySubdivisions, maxValue, minValue}
    }

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {/* Add/Remove from Gradient */}
                <IconButton sx={{ ml: '5%', padding: 0.25 }}
                    onClick={() => {
                        setMapEditMode(`AddToGradient-${gradient.dataField}`);
                    }}
                >
                    <AddIcon />
                </IconButton>
                <IconButton sx={{ padding: 0.25 }}
                    onClick={() => {
                        setMapEditMode(`DeleteFromGradient-${gradient.dataField}`);
                    }}
                >
                    <RemoveIcon />
                </IconButton>

                {/* Color squares */}
                <Box sx={{ width: 30, height: 30, backgroundColor: color, borderRadius: '5px', marginRight: '2px' }} onClick={() => setDisplayColorPicker(!displayColorPicker)} />
                <Box sx={{ width: 30, height: 30, backgroundColor: color2, borderRadius: '5px', marginRight: '2px' }} onClick={() => setDisplayColorPicker2(!displayColorPicker2)} />
                {/* Gradient value dropdown */}
                <Select 
                    value={valueOptions ? name : ''}
                    sx={{ marginLeft: 'auto' }}
                    InputProps={{ sx: { borderRadius: 3 } }}
                    onChange={e => {
                        setName(e.target.value)

                        // Update the valueOptions to remove the selected value and add the old value back
                        /* const newOptions = valueOptions.filter(opt => opt.value !== e.target.value)
                        setValueOptions([...newOptions, {value: name, label: name}]) */

                        // Find subdivisions that have the data field
                        const {keySubdivisions, maxValue, minValue} = getKeySubdivisions();

                        // Generating colors for each subdivision based on its value
                        const newSubdivisions = keySubdivisions.map(subdivision => {
                            const gradient = mapSchema.gradients.find(gradient => gradient.dataField === name);
                            return gradient ? {...subdivision, color: interpolateColor(subdivision.data[name], minValue, maxValue, color, color2), weight: 0.5} : subdivision;
                        });

                        // Replace the original subdivisions
                        const combinedSubdivisions = mapSchema.subdivisions.map(subdivision => {
                            return newSubdivisions.find(subdivision2 => subdivision2.name === subdivision.name) || subdivision;
                        })


                        // Remove the old gradient from the schema
                        const newGradients = mapSchema.gradients.filter(grd => grd.dataField !== name);

                        // Updates the schema to update the bin color
                        updateSchema({...mapSchema, subdivisions: combinedSubdivisions, gradients: [...newGradients, { dataField: e.target.value, minColor: color, maxColor: color2}]})
                    }}  
                >
                    {valueOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </MenuItem>
                    ))}
                </Select>

                {/* Delete Gradient */}
                <IconButton>
                <DeleteIcon  sx={{ marginLeft: 'auto' }} />  
                </IconButton>
            </Box>

            {/* Color Pickers */}
            {/* <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'right', justifyItems: 'right', marginRight: '15%' }}>  
                {displayColorPicker && (<TwitterPicker color={color} onChangeComplete={color => setColor(color.hex)} sx={{ marginLeft: 'auto'}} triangle='hide'/>)}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'right', justifyItems: 'right', marginRight: '15%' }}>  
                {displayColorPicker2 && (<TwitterPicker color={color2} onChangeComplete={color => setColor2(color.hex)} sx={{ marginLeft: 'auto'}} triangle='hide'/>)}
            </Box> */}

            {displayColorPicker && 
                <ClickAwayListener onClickAway={() => setDisplayColorPicker(false)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'right', justifyItems: 'right', marginRight: '15%' }}>  
                        <TwitterPicker color={color} onChangeComplete={color => {
                            setColor(color.hex);

                            // Find subdivisions that have the data field
                            const {keySubdivisions, maxValue, minValue} = getKeySubdivisions();

                            // Generating colors for each subdivision based on its value
                            const newSubdivisions = keySubdivisions.map(subdivision => {
                                const gradient = mapSchema.gradients.find(gradient => gradient.dataField === name);
                                return gradient ? {...subdivision, color: interpolateColor(subdivision.data[name], minValue, maxValue, color.hex, gradient.maxColor), weight: 0.5} : subdivision;
                            });

                            // Replace the original subdivisions
                            const combinedSubdivisions = mapSchema.subdivisions.map(subdivision => {
                                return newSubdivisions.find(subdivision2 => subdivision2.name === subdivision.name) || subdivision;
                            })

                            // Updates the schema to update the bin color
                            updateSchema({...mapSchema, subdivisions: combinedSubdivisions, gradients: mapSchema.gradients.map(grd => {
                                return grd.dataField === name
                                ? {...grd, minColor: color.hex} : grd;
                            })})

                        }} 
                        sx={{ marginLeft: 'auto'}} triangle='hide'/>
                    </Box>
                </ClickAwayListener>
            }
            
            {displayColorPicker2 && 
                <ClickAwayListener onClickAway={() => setDisplayColorPicker2(false)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'right', justifyItems: 'right', marginRight: '15%' }}>  
                        <TwitterPicker color={color2} onChangeComplete={color => {
                            setColor2(color.hex);

                            // Find subdivisions that have the data field
                            const {keySubdivisions, maxValue, minValue} = getKeySubdivisions();

                            // Generating colors for each subdivision based on its value
                            const newSubdivisions = keySubdivisions.map(subdivision => {
                                const gradient = mapSchema.gradients.find(gradient => gradient.dataField === name);
                                return gradient ? {...subdivision, color: interpolateColor(subdivision.data[name], minValue, maxValue, gradient.minColor, color.hex), weight: 0.5} : subdivision;
                            });

                            // Replace the original subdivisions
                            const combinedSubdivisions = mapSchema.subdivisions.map(subdivision => {
                                return newSubdivisions.find(subdivision2 => subdivision2.name === subdivision.name) || subdivision;
                            })
                            
                            // Updates the schema to update the bin color
                            updateSchema({...mapSchema, subdivisions: combinedSubdivisions, gradients: mapSchema.gradients.map(grd => {
                                return grd.dataField === name
                                ? {...grd, maxColor: color.hex} : grd;
                            })})

                        }} 
                        sx={{ marginLeft: 'auto'}} triangle='hide'/>
                    </Box>
                </ClickAwayListener>
            }
        </>
    )
}