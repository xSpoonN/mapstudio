import { useState, useEffect, useContext } from 'react';
import { GlobalStoreContext } from '../store';
import { Box, TextField, Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';

export default function SubdivisionItem({sub, allProperties, mapId, mapSchema, chosenProp, setFeature}) {
    /* const [dropdownOptions, setDropdownOptions] = useState([]);
    const [dropdownValue, setDropdownValue] = useState(''); */
    const [value, setValue] = useState('');
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        const retrieveData = async () => {
                /* if (sub?.data) { */
                let options;
                if (sub?.data) options = Object.getOwnPropertyNames(sub?.data); // Get the object properties of the subdivision as an array
                else options = [];
                /* setDropdownOptions(allProperties || options) // Set the dropdown options to the list of all properties
                setDropdownValue(options ? options[0] : ''); */
                if (sub?.data && options?.includes(chosenProp)) setValue(sub?.data[chosenProp] || 'N/A')
                else setValue('N/A')
                /* } else {
                    setDropdownOptions([]);
                    setDropdownValue('');
                    setValue('N/A');
                } */
        }
        retrieveData();
    }, [sub, allProperties, chosenProp]) // eslint-disable-line react-hooks/exhaustive-deps

    // Handles pushing the updated map schema to store
    const updateSchema = async (updatedSchema) => {
        // Removes the prop from props since it now exists in data
        if (mapSchema.props?.includes(chosenProp)) updatedSchema = {...updatedSchema, props: updatedSchema.props.filter(p => p !== chosenProp)};
        await store.updateMapSchema(mapId, updatedSchema);
        if (sub) { // If a subdivision is selected
            // Find the subdivision in the map schema
            const match = updatedSchema?.subdivisions?.find(subdivision => // Need to check all possible name fields because of inconsistencies in the geojson data
                subdivision.name === sub.name || subdivision.name === sub.NAME || subdivision.name === sub.Name
            );
            if (match) {
                setValue(match?.data[chosenProp] || 'N/A')
            }
        }
    }

    return(
        <ListItem>
            <Typography variant="h6" onClick={() => setFeature(sub)}>{sub?.name}</Typography>
            {/* <Typography sx={{ marginLeft: 'auto', marginRight:'10px'}}>{value}</Typography> */}
            <TextField value={value} sx={{ marginRight: '5px', marginLeft: 'auto', width: '100px'}}
                inputProps={{style: { textAlign: 'right'}}} InputProps={{ sx: { borderRadius: 3, height: '50px' } }}
                onChange={e => { 
                    setValue(e.target.value); 
                }}
                onBlur={() => {
                    // Find the subdivision in the map schema
                    const existing = mapSchema?.subdivisions?.find(subdivision => 
                        subdivision.name === sub.name || subdivision.name === sub.NAME || subdivision.name === sub.Name
                    );
                    if (existing) { // Technically this should always be true
                        // Finds the matching subdivision in the data and updates the property's value
                        updateSchema({...mapSchema, subdivisions: mapSchema.subdivisions.map(subdivision => {
                            return subdivision.name === sub.name || subdivision.name === sub.NAME || subdivision.name === sub.Name 
                            ? {...subdivision, data: {...subdivision.data, [chosenProp]: value}} : subdivision;
                        })})
                    } else {
                        // Adds a new subdivision to the data with the property's value
                        updateSchema({...mapSchema, 
                            subdivisions: [...mapSchema.subdivisions, {name: sub.name || sub.NAME || sub.Name, data: {[chosenProp]: value}}]
                        })
                    }
                }}
                />
            <Box sx={{ width: 30, height: 30, borderRadius: '5px', backgroundColor: sub.color ? sub.color : "#ffffff", marginLeft: '10px' }}  onClick={() => setFeature(sub)}/>
        </ListItem>
    )
}