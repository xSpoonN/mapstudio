import { useState, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import { Box, /* Typography, */ IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Property({propName, mapSchema, mapData}) {
    const [name, setName] = useState(propName);
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        setName(propName);
    }, [propName])

    // Handles pushing the updated map schema to store
    const updateSchema = async (updatedSchema) => {
        await store.updateMapSchema(mapData._id, updatedSchema);
        console.log(updatedSchema)
        const match = updatedSchema?.props?.find(p => p === name ); // Find the bin that was just updated
        if (match) { // If it exists, update the current name and color
            setName(match.name);
        }
    }
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {/* Property Name */}
                <TextField value={name} sx={{ marginLeft: 'auto', maxWidth: '250px' }} inputProps={{style: { textAlign: 'right'}, maxLength: 50}} InputProps={{ sx: { borderRadius: 3 } }} 
                    onChange={e => setName(e.target.value)} 
                    onBlur={async () => {
                        const nameExists = mapSchema.props?.some(p => p === name); // Check if the name already exists
                        const dataFieldsSet = new Set();
                        mapSchema?.subdivisions?.forEach(sbd => { Object.keys(sbd.data || {}).forEach(key => dataFieldsSet.add(key)); })
                        const dataFields = [...dataFieldsSet];
                        const propExists = dataFields.some(p => p === name); // Check if the name already exists
                        if (!nameExists && !propExists) { // If it doesn't, update the schema
                            await updateSchema({...mapSchema, 
                                subdivisions: mapSchema.subdivisions.map(subdivision => { // Update the data field for all subdivisions
                                    const {[propName]: value, ...rest} = subdivision.data || {};
                                    if (!value) return subdivision;
                                    return {...subdivision, data: {...rest, [name]: value}};
                                }),
                                gradients: mapSchema.gradients.map(gradient => { // Update the data field for all gradients
                                    return (gradient.dataField === propName) ? {...gradient, dataField: name} : gradient;
                                }),
                                props: mapSchema.props?.map(p => p === propName ? name : p)});
                        } else { // If it does, reset the name
                            setName(propName);
                            console.log('Name already exists');
                        }
                    }}
                />

                {/* Delete Bin */}
                <IconButton 
                    onClick={() => {
                        // Find subdivisions that have the data field
                        const keySubdivisions = mapSchema.subdivisions.filter(subdivision => Object.keys(subdivision.data || {}).includes(name));
                        // Finds any subdivisions that had the property, and delete it from their data
                        const newSubdivisions = (keySubdivisions || []).map(subdivision => {
                            if (Object.keys(subdivision.data || {})?.includes(name)) {
                                const {[name]: value, ...rest} = subdivision.data;
                                return {...subdivision, data: rest};
                            } else {
                                return subdivision;
                            }
                        });

                        const combinedSubdivisions = [...newSubdivisions, ...mapSchema.subdivisions.filter(subdivision => !Object.keys(subdivision.data || {}).includes(name))];

                        // Updates the schema to remove the property
                        updateSchema({...mapSchema, subdivisions: combinedSubdivisions, props: mapSchema.props?.filter(p => p !== name)});
                    }}
                >
                <DeleteIcon  sx={{ marginLeft: 'auto' }} />  
                </IconButton>
            </Box>
        </>
    )
}