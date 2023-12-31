import { useState, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store'
import MapCard from './MapCard';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';

export default function SearchScreen(props) {
    const { store } = useContext(GlobalStoreContext);
    const [filter, setFilter] = useState('none');
    const [sort, setSort] = useState('Newest');
    const [maps, setMaps] = useState([]);
    const [search, setSearch] = useState(props.search || '');

    useEffect(() => {
        const fetchMaps = async () => {
            const maps = await store.getPublishedMaps();
            const result = [];
            for (let i = 0; i < maps.maps.length; i++) {
                result.push({ map: maps.maps[i], author: maps.authors[i], type: maps.schemas[i] ?  maps.schemas[i].type : 'none'});
            }
            console.log(result)
            setMaps(result)
        }
        fetchMaps();
    }, [store])

    const handleSetFilter = (event) => {
        setFilter(event.target.value);
    };

    const handleSetSort = (event) => {
        setSort(event.target.value);
    };

    const handleSetSearch = (event) => {
        setSearch(event.target.value);
    };

    function handleSortAndFilter(maps) {
        let sorted = maps
        if (filter !== 'none') {
            sorted = maps.filter((map, index) => {
                return map.type === filter
            })
        }
        if(sort === "Newest") {
            sorted = sorted.sort((a, b) => new Date(b.map.publishedDate) - new Date(a.map.publishedDate));
        } else if(sort === "Most Liked") {
            sorted = sorted.sort((a, b) => b.map.likes - a.map.likes);
        } else if(sort === "Most Commented") {
            sorted = sorted.sort((a, b) => b.map.comments.length - a.map.comments.length);
        }
        if (search) {
            sorted = sorted.filter(map => {
                const tags = search.toLowerCase().split(' ');
                if(tags[0]?.startsWith('author:')) {
                    let author = tags[0].slice('author:'.length)
                    tags.shift()
                    let title = tags.join(" ")
                    return map.map.title.toLowerCase().includes(title.toLowerCase())
                            && map.author.username.toLowerCase() === author.toLowerCase()
                }
                return map.map.title.toLowerCase().includes(search.toLowerCase())
                        || map.author.username.toLowerCase().includes(search.toLowerCase())
            });
        }
        return sorted;
    }

    return (
        <Box>
            <Box display="flex" flexDirection="row" alignItems="center">
                <Typography variant="h2" align="left" sx={{ m: 6 }} color='#E3256B'>
                    Browse Maps
                </Typography>
                <Typography variant="h3" align="left" sx={{ m: 6 }} color='#000000' flexGrow={1}>
                    {handleSortAndFilter(maps).length}
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
                        placeholder="Search Maps..."
						style = {{ width: '75%' }}
                        value={search}
                        onChange={handleSetSearch}
					/>
				</Box>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
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
                        <MenuItem value="Most Liked">Most Liked</MenuItem>
                        <MenuItem value="Most Commented">Most Commented</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ m: 1, minWidth: 200 }}>
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
                        <MenuItem value="none">None</MenuItem>
                        <MenuItem value="bin">Bin Map</MenuItem>
                        <MenuItem value="gradient">Gradient Map</MenuItem>
                        <MenuItem value="heatmap">Heat Map</MenuItem>
                        <MenuItem value="point">Point Map</MenuItem>
                        <MenuItem value="satellite">Satellite Map</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container
                spacing={0}
                direction="row"
                alignItems="center"
                justify="center"
            >
                {handleSortAndFilter(maps).map((map) => (
                    <Grid item lg={3} md={4} sm={6} xs={12} align="center" sx={{ my: 4 }}>
                        <MapCard
                            mapID={map.map._id}
                            name={map.map.title}
                            lastEdited={map.map.updateDate}
                            style={{ width: '600px', height: '300px' }}
                            views={map.map.__v}
                            likes={map.map.likes}
                            dislikes={map.map.dislikes}
                            author={map.author.username}
                            comments={map.map.comments.length}
                        />
                    </Grid>   
                ))}
            </Grid>
        </Box>
    )
}