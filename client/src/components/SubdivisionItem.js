import { useState, useEffect } from 'react';
import { Select, MenuItem, Box, Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';

export default function SubdivisionItem({sub, setFeature}) {
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [dropdownValue, setDropdownValue] = useState('');
    const [value, setValue] = useState('');

    useEffect(() => {
        const retrieveData = async () => {
                if (sub?.data) {
                    const options = Object.getOwnPropertyNames(sub.data); // Get the object properties of the subdivision as an array
                    setDropdownOptions(options)
                    setDropdownValue(options ? options[0] : '');
                    setValue(options ? sub.data[options[0]] : '');
                } else {
                    setDropdownOptions([]);
                    setDropdownValue('');
                    setValue('N/A');
                }
        }
        retrieveData();
    }, [sub]) // eslint-disable-line react-hooks/exhaustive-deps

    return(
        <ListItem onClick={() => setFeature(sub)}>
            <Grid container spacing={2}>
                <Grid item xs={3} alignContent='center'>
                    <Typography variant="h6">{sub?.name}</Typography>
                </Grid>
                <Grid item xs={4} alignContent='center'>
                    <Select value={dropdownValue} onChange={e => {
                        setDropdownValue(e.target.value);
                        setValue(sub?.data[e.target.value] ? sub.data[e.target.value] : '') // Set the value to the existing value if it exists, otherwise set it to empty string
                    }} sx={{ borderRadius: 3 }} onClick={e => e.stopPropagation()}>
                        {dropdownOptions.map(option => <MenuItem value={option}>{option}</MenuItem>)}
                    </Select>
                </Grid>
                <Grid item xs={4}>
                    <Typography>{value}</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Box sx={{ width: 30, height: 30, borderRadius: '5px', backgroundColor: sub.color ? sub.color : "#ffffff", marginLeft: 'auto' }} />
                </Grid>
            </Grid>
        </ListItem>
    )
}