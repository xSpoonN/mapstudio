import { useEffect, useState, useContext } from 'react';
import { GlobalStoreContext } from '../store';
import { TextField, FormControlLabel, Checkbox, Divider, Box } from '@mui/material';

export default function MapInfoSidebar({ mapData }) {
    const [mapInfo, setMapInfo] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [satelliteView, setSatelliteView] = useState(false);
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        const retrieveData = async () => {
            console.log(mapData)
            setMapInfo(mapData);
            setTitle(mapData?.title ? mapData.title : '');
            setDescription(mapData?.description ? mapData.description : '');
        }
        retrieveData();
    }, [mapData])

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            <TextField
                label="Title"
                value={title}
                style={{margin: '10px', width: '80%'}}
                inputProps={{style: { textAlign: 'center'}}} // Do not ask why capitalization matters here...
                InputProps={{ sx: { borderRadius: 3 } }}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={async () => {store.setMapData({ ...mapInfo, title: title }); const resp = await store.updateMapData({ ...mapInfo, title: title }); console.log(resp)}}
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
                onBlur={async () => {store.setMapData({ ...mapInfo, description: description }); const resp = await store.updateMapData({ ...mapInfo, description: description }); console.log(resp)}}
            />
            <Divider variant='middle' style={{ width: '80%', margin: '5px', marginTop: 'auto', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2}}/>
            <FormControlLabel
                label="Satellite View"
                control={
                    <Checkbox
                        checked={satelliteView}
                        onChange={(e) => setSatelliteView(e.target.checked)}
                        onBlur={async () => {store.setMapData({ ...mapInfo, satelliteView: satelliteView }); const resp = await store.updateMapData({ ...mapInfo, satelliteView: satelliteView }); console.log(resp)}}
                    />
                }
            />
        </Box>
    );
}