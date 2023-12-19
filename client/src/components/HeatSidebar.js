import React ,{ useState, useEffect } from 'react';
import { Button, Divider, Box, Slider, Typography, Pagination, Grid, List, ListItem} from '@mui/material';
import 'leaflet.heat';

export default function HeatMapSidebar({ mapSchema, onHeatMapChange, uploadCSV, clearHeatMap, heatExistingPoints, panToPoint }) {
    const [radius, setRadius] = useState(mapSchema?.heatmaps[0]?.radius);
    const [blur, setBlur] = useState(mapSchema?.heatmaps[0]?.blur);
    const [currentPage, setCurrentPage] = useState(1);

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const currentData = mapSchema?.heatmaps[0]?.points?.slice(startIndex, endIndex);

    useEffect(() => {
        onHeatMapChange(radius, blur, false);
    }, [radius, blur]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if(mapSchema?.heatmaps.length !== 0) {
            setRadius(mapSchema?.heatmaps[0]?.radius)
            setBlur(mapSchema?.heatmaps[0]?.blur)
        }
    }, [mapSchema]); // eslint-disable-line react-hooks/exhaustive-deps

    function handleCommit() {
        onHeatMapChange(radius, blur, true);
    }

    let list = <></>
    if(mapSchema?.heatmaps?.length !== 0) {
        list =
            <>
            <Typography variant="h6" style={{ margin: '10px' }}>All Points</Typography>
                <List sx={{ width: '90%' }}>
                    {currentData.map((point) => (
                        <>
                            <ListItem onClick={() => panToPoint(point?.location.lat, point?.location.lon)}>
                                <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography variant="h6">{point.name}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>{point?.location?.lat.toFixed(2)}, {point?.location?.lon.toFixed(2)}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>Weight: {point?.weight.toFixed(2)}</Typography>
                                </Grid>
                                </Grid>
                            </ListItem>
                            <Divider variant='middle' style={{ width: '100%', margin: '5px', backgroundColor: '#dddddd', borderRadius: '2px' }} sx={{ borderBottomWidth: 2 }} />
                        </>
                    ))}
                </List>
                <Pagination
                    count={Math.ceil(mapSchema?.heatmaps[0]?.points?.length/10)}
                    page={currentPage}
                    onChange={handleChangePage}
                    variant="outlined"
                    color="razzmatazz"
                />
            </>

    }

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Typography variant="h6" style={{ margin: '10px' }}>Heat Map</Typography>
            <Divider variant='middle' style={{ width: '60%', margin: '5px', backgroundColor: '#555555', borderRadius: '2px' }} />
            
            <Box 
                sx={{
                    width:'70%',mt:8, mb: 2, 
                    '& .MuiSlider-thumb': {
                    color: '#E3256B',
                    },
                    '& .MuiSlider-track': {
                        color: '#E3256B', 
                }}}
            >
                <Typography gutterBottom>Radius</Typography>
                <Slider
                    value={radius}
                    onChange={(e, newValue) => setRadius(newValue)}
                    onChangeCommitted={handleCommit}
                    aria-labelledby="radius-slider"
                    valueLabelDisplay="auto"
                    min={10}
                    max={50}
                />
            </Box>
            <Box
                sx={{
                    width:'70%',mb: 2, 
                    '& .MuiSlider-thumb': {
                    color: '#E3256B', 
                    },
                    '& .MuiSlider-track': {
                        color: '#E3256B', 
                }}}
            >
                <Typography gutterBottom>Blur</Typography>
                <Slider
                    value={blur}
                    onChange={(e, newValue) => setBlur(newValue)}
                    onChangeCommitted={handleCommit}
                    aria-labelledby="blur-slider"
                    valueLabelDisplay="auto"
                    min={10}
                    max={50}
                />
            </Box>

            <Button variant="contained" component="label" style={{ margin: '10px', backgroundColor: '#E3256B'}}>
                Upload new CSV File
                <input type="file" accept='.csv' hidden onChange={uploadCSV} />
            </Button>
            <Button variant="contained" component="label" style={{ margin: '10px', backgroundColor: '#E3256B'}} onClick={() => heatExistingPoints()}>
                Use existing points
            </Button>
            <Button variant="contained" component="label" style={{ margin: '10px', backgroundColor: '#E3256B'}} onClick={() => clearHeatMap()}>
                Clear
            </Button>
            {list}
        </Box>
    );
}
