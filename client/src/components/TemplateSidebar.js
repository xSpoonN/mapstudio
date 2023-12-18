import { Divider, Box, Typography } from '@mui/material';

const templates = [
    {
        name: 'Bin Map',
        description: 'Useful for discrete categorization',
        image: 'https://source.unsplash.com/random/500x300'
    },
    {
        name: 'Gradient Map',
        description: 'Useful for representing continuous data',
        image: 'https://source.unsplash.com/random/500x300'
    },
    {
        name: 'Heat Map',
        description: 'Useful for representing areas of intensity',
        image: 'https://source.unsplash.com/random/500x300'
    },
    {
        name: 'Point Map',
        description: 'Useful for representing labeled points',
        image: 'https://source.unsplash.com/random/500x300'
    },
    {
        name: 'Satellite Map',
        description: 'Useful for visualizing geography',
        image: 'https://source.unsplash.com/random/500x300'
    }
]

export default function TemplateSidebar({mapSchema, changeTemplate}) {

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }} >
            <Typography variant="h6" style={{ margin: '10px' }}>Templates</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
            {templates.map(template => (
                <Box
                    key={template.name}
                    sx={{ display: 'flex', alignItems: 'center', p: 2, m: 0.5, borderRadius: 5, width: '75%', height: '20%', backgroundColor: '#EEEEEE', border: mapSchema.type === template.name.split(" ")[0].toLowerCase() ? 3 : ((mapSchema.type === 'heatmap' && template.name === "Heat Map") ? 3 : 0) }}
                    onClick={() => changeTemplate(template.name)}
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