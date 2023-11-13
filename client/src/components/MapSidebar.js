import { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Divider, Box } from '@mui/material';

export default function MapInfoSidebar() {
    const [title, setTitle] = useState('Map of the Mongol Empire');
    const [description, setDescription] = useState('From the vast steppes of Central Asia, the Mongol Empire rose to become one of the most powerful and influential empires in history. Led by the charismatic and brilliant Genghis Khan, the Mongols conquered a vast swath of territory, stretching from the Pacific Ocean to the Black Sea.');
    const [satelliteView, setSatelliteView] = useState(false);

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            <TextField
                label="Title"
                value={title}
                style={{margin: '10px', width: '80%'}}
                inputProps={{style: { textAlign: 'center'}}} // Do not ask why capitalization matters here...
                InputProps={{ sx: { borderRadius: 3 } }}
                onChange={(e) => setTitle(e.target.value)}
            />
            <Divider variant='middle' style={{ width: '80%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2}}/>
            <TextField
                label="Description"
                multiline
                rows={20}
                value={description}
                style={{margin: '10px', width: '80%'}}
                InputProps={{ sx: { borderRadius: 3 } }}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Divider variant='middle' style={{ width: '80%', margin: '5px', marginTop: 'auto', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2}}/>
            <FormControlLabel
                label="Satellite View"
                control={
                    <Checkbox
                        checked={satelliteView}
                        onChange={(e) => setSatelliteView(e.target.checked)}
                    />
                }
            />
        </Box>
    );
}