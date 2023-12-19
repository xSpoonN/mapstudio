import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import { Divider, Box, Typography } from '@mui/material';

const SASTOKENMAP = 'sp=r&st=2023-12-03T19:46:53Z&se=2025-01-09T03:46:53Z&sv=2022-11-02&sr=c&sig=LL0JUIq%2F3ZfOrYW8y4F4lk67ZXHFlGdmY%2BktKsHPkss%3D';
const templates = [
    {
        name: 'Bin Map',
        description: 'Useful for discrete categorization',
        mapFile: 'https://mapstudio.blob.core.windows.net/mapfiles/geojson6580c020336ecfedb50999db.json',
        mapSchema: '6580c091336ecfedb5099b89',
        image: '/bin.PNG'
    },
    {
        name: 'Gradient Map',
        description: 'Useful for representing continuous data',
        mapFile: 'https://mapstudio.blob.core.windows.net/mapfiles/geojson6580c9d2f3d530d8d2c03702.json',
        mapSchema: '6580cb85452cc86fb14a10d4',
        image: '/gradient.PNG'
    },
    {
        name: 'Heat Map',
        description: 'Useful for representing areas of intensity',
        mapFile: 'https://mapstudio.blob.core.windows.net/mapfiles/geojson6580f485336ecfedb509c63e.json',
        mapSchema: '6580f49c336ecfedb509c64e',
        image: '/heat.PNG'
    },
    {
        name: 'Point Map',
        description: 'Useful for representing labeled points',
        mapFile: 'https://mapstudio.blob.core.windows.net/mapfiles/geojson6580e99e452cc86fb14a15b8.json',
        mapSchema: '6580ea41336ecfedb509be93',
        image: '/point.PNG'
    },
    {
        name: 'Satellite Map',
        description: 'Useful for visualizing geography',
        mapFile: 'https://mapstudio.blob.core.windows.net/mapfiles/geojson6580efae2b06b54815324f22.json',
        mapSchema: '6580f0eb2b06b54815324fec',
        image: '/satellite.PNG'
    }
]

export default function TemplateSidebar({mapSchema, changeTemplate, mapId}) {
    const { store } = useContext(GlobalStoreContext);
    async function handleTemplate(template) {
        const map = templates.find(t => t.name === template)
        let mapJSON = null
        await fetch(`${map?.mapFile}?${SASTOKENMAP}`, {mode: "cors"})
            .then((response) => response.json())
            .then((data) => {
                mapJSON = data;
            }).catch((error) => {
                mapJSON = null
            });
        let schema = null
        if(map?.mapSchema) {
            schema = await store.getSchema(map?.mapSchema);
            if(schema) {
                delete schema._id
                delete schema.__v
            }
        }
        await store.updateMapFile(mapId, mapJSON);
        await store.updateMapSchema(mapId, schema);
    }
    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            <Typography variant="h6" style={{ margin: '10px' }}>Templates</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
            {templates.map(template => (
                <Box
                    key={template.name}
                    sx={{ display: 'flex', alignItems: 'center', p: 2, m: 0.5, borderRadius: 5, width: '75%', height: '20%', backgroundColor: '#EEEEEE', border: mapSchema?.type === template.name.split(" ")[0].toLowerCase() ? 3 : ((mapSchema?.type === 'heatmap' && template.name === "Heat Map") ? 3 : 0) }}
                    onClick={() => handleTemplate(template.name)}
                >
                    <img src={template.image} width={150} alt="Template Preview" />
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="h6" fontWeight='bold'>{template.name}</Typography>
                        <Typography variant="body2">{template.description}</Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}