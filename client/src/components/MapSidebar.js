import { useEffect, useState, useContext } from 'react';
import { GlobalStoreContext } from '../store';
import { TextField, FormControlLabel, Checkbox, Divider, Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function MapInfoSidebar({ mapData, mapSchema, setShowSatellite }) {
    const [mapInfo, setMapInfo] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [satelliteView, setSatelliteView] = useState(false);
    const [category, setCategory] = useState('none')
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        const retrieveData = async () => {
            /* console.log(mapData) */
            console.log(mapData);
            setMapInfo(mapData);
            setTitle(mapData?.title ? mapData.title : '');
            setDescription(mapData?.description ? mapData.description : '');
            setCategory(mapSchema?.type ? mapSchema.type : 'none')
        }
        retrieveData();
    }, [/* mapData, */ mapSchema]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleSetCategory = (event) => {
        store.updateMapSchema(mapData._id, {...mapSchema, type: event.target.value});
    };

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            <TextField
                label="Title"
                value={title}
                style={{margin: '10px', width: '80%'}}
                inputProps={{style: { textAlign: 'center'}, maxLength: 50}} // Do not ask why capitalization matters here...
                InputProps={{ sx: { borderRadius: 3 } }}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                onBlur={async () => {
                    /* store.setMapData({ ...mapInfo, title: title });  */
                    setMapInfo({ ...mapInfo, title: title });
                    const resp = await store.updateMapInfo({ ...mapInfo, title: title }); 
                    mapData.title = title;
                    console.log(resp)
                }}
            />
            <Divider variant='middle' style={{ width: '80%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2}}/>
            <TextField
                label="Description"
                multiline
                rows={20}
                value={description}
                style={{margin: '10px', width: '80%'}}
                inputProps={{ maxLength: 1000 }}
                InputProps={{ sx: { borderRadius: 3 } }}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                onBlur={async () => {
                    /* store.setMapData({ ...mapInfo, description: description }); */
                    setMapInfo({ ...mapInfo, description: description }); 
                    const resp = await store.updateMapInfo({ ...mapInfo, description: description }); 
                    mapData.description = description;
                    console.log(resp)
                }}
            />
            <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel>Category</InputLabel>
                <Select
                    id="demo-select-small"
                    value={category}
                    label="Category"
                    onChange={handleSetCategory}
                    displayEmpty
                    sx={{
                        background: 'white',
                        borderRadius: '16px',
                        "& label.Mui-focused": {
                            color: '#E3256B'
                        }
                    }}
                >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="bin">Bin Map</MenuItem>
                    <MenuItem value="gradient">Gradient Map</MenuItem>
                    <MenuItem value="heatmap">Heat Map</MenuItem>
                    <MenuItem value="point">Point Map</MenuItem>
                    <MenuItem value="satellite">Satellite Map</MenuItem>
                </Select>
            </FormControl>
            <Divider variant='middle' style={{ width: '80%', margin: '5px', marginTop: 'auto', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2}}/>
            <FormControlLabel
                label="Satellite View"
                control={
                    <Checkbox
                        checked={satelliteView}
                        onChange={async (e) => {
                            setSatelliteView(e.target.checked)
                            setShowSatellite(e.target.checked)
                            setMapInfo({ ...mapInfo, showSatellite: e.target.checked })
                            await store.updateMapSchema(mapData._id, { ...mapSchema, showSatellite: e.target.checked })
                            mapSchema.showSatellite = e.target.checked;
                        }}
                    />
                }
            />
        </Box>
    );
}