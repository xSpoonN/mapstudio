import { useState, useContext, useEffect } from 'react';
import MapCard from './MapCard';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function PersonalMapsScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const [filter, setFilter] = useState('None');
    const [sort, setSort] = useState('Newest');
    const [maps, setMaps] = useState([]);

    useEffect(() => {
        const fetchMaps = async () => {
            const resp = await auth.getUserData(auth.getUser().email);
            console.log(resp);
            if (resp.success) {
                const maps = await store.getMapsData(resp.user);
                console.log(maps);
                setMaps(maps);
            }
        }
        fetchMaps();
    }, [auth, store]);

    const handleSetFilter = (event) => {
        setFilter(event.target.value);
    };

    const handleSetSort = (event) => {
        setSort(event.target.value);
    };

    const handleCreateNewMap = async () => {
        console.log("Recv create new map request");
        const authReq = await auth.getUserData(auth.user.email);
        console.log(authReq);
        store.createNewMap(authReq.user._id, 'New Map', 'Description');
    };

    return (
        <Box>
            <Box display="flex" flexDirection="row" alignItems="flex-end">
                <Typography variant="h2" align="left" sx={{ mx: 6, my: 6 }} color='#E3256B'>
                    Your Maps
                </Typography>
                <Typography variant="h3" align="left" sx={{ mx: 6, my: 6 }} color='#000000' flexGrow={1}>
                    {maps?.length}
                </Typography>
                <Box justifyContent="center" sx={{ flexGrow: 2, mx: 6, my: 6 }}>
					<TextField
						id="standard-basic"
						variant="outlined" 
						InputProps={{
							endAdornment: (
									<IconButton position="end">
											<SearchIcon/>
									</IconButton>
							),
							style: {fontSize: '14pt'}
						}}
						sx={{
							background: 'white',
							borderRadius: '16px',
							"& fieldset": { borderRadius: '16px' },
							'&:hover fieldset': {
								border: 'none'
							},
							"& .MuiOutlinedInput-root": {
								"&.Mui-focused fieldset": {
								  border: 'none'
								}
							}
						}}
						style = {{ width: '75%' }}
					/>
				</Box>
                <Button 
                    variant="contained"
                    sx={{ mx: 8, my: 6, color: 'white' }} 
                    style={{fontSize:'16pt', maxWidth: '135px', maxHeight: '50px', minWidth: '135px', minHeight: '50px'}} 
                    disableRipple
                    color='razzmatazz'
                    onClick={handleCreateNewMap}
                >
                    Create +
                </Button>
                <FormControl sx={{ mx: 1, my: 6, minWidth: 200 }}>
                <InputLabel>Sort</InputLabel>
                    <Select
                        id="demo-select-small"
                        value={sort}
                        label="Sort"
                        onChange={handleSetSort}
                        displayEmpty
                        sx={{
                            background: 'white',
                            borderRadius: '16px',
                            "& label.Mui-focused": {
                                color: '#E3256B'
                            }
                        }}
                    >
                        <MenuItem value="Newest">Newest</MenuItem>
                        <MenuItem value="Most Liked">Most liked</MenuItem>
                        <MenuItem value="Most Viewed">Most viewed</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ ml: 1, mr: 6, my: 6, minWidth: 200 }}>
                <InputLabel>Filter</InputLabel>
                    <Select
                        id="demo-select-small"
                        value={filter}
                        label="Filter"
                        onChange={handleSetFilter}
                        displayEmpty
                        sx={{
                            background: 'white',
                            borderRadius: '16px',
                            "& label.Mui-focused": {
                                color: '#E3256B'
                            }
                        }}
                    >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="Bin Map">Bin Map</MenuItem>
                        <MenuItem value="Gradient Map">Gradient Map</MenuItem>
                        <MenuItem value="Heat Map">Heat Map</MenuItem>
                        <MenuItem value="Point Map">Point Map</MenuItem>
                        <MenuItem value="Satellite Map">Satellite Map</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container
                spacing={0}
                direction="row"
                alignItems="center"
                justify="center"
            >
                {maps.map((map, index) => (
                    <Grid item lg={3} md={4} sm={6} xs={12} align="center" sx={{ my: 4 }}>
                        <MapCard 
                        mapID={map._id}
                        name={map.title}
                        lastEdited={map.updateDate} 
                        shared={map.isPublished ? "Public" : "Private"}
                        views={map.__v}
                        likes={map.likes}
                        dislikes={map.dislikes}
                        />
                    </Grid>   
                ))}
            </Grid>
        </Box>
    )
}
