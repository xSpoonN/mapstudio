import { useState } from 'react';
import { TextField, FormControlLabel, Checkbox, Divider, Box } from '@mui/material';

export default function MapInfoSidebar() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [satelliteView, setSatelliteView] = useState(false);

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            <TextField
                label="Title"
                value={title}
                style={{margin: '10px', width: '80%'}}
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
            {/* <div style={{ marginTop: 'auto'}}> */}
                <FormControlLabel
                    label="Satellite View"
                    control={
                        <Checkbox
                            checked={satelliteView}
                            onChange={(e) => setSatelliteView(e.target.checked)}
                        />
                    }
                />
            {/* </div> */}
        </Box>
    );
}