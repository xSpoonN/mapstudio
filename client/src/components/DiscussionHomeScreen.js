import { useState, useContext } from 'react';
import GlobalStoreContext from '../store';
import AuthContext from '../auth';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import DiscussionPostListCard from './DiscussionPostListCard';

const styles = {
    scroll: {
        scrollbarWidth: 'thin'
    }
}

export default function DiscussionHomeScreen(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [sort, setSort] = useState('Newest');
    const [filter, setFilter] = useState(props.filter || '')

    const handleSetSort = (event) => {
        setSort(event.target.value);
    };

    function handleCreate() {
        if (auth.user)
            store.changeToDiscussionPostNew();
        else
            store.changeToLogin();
    }

    function handleSortAndFilter(posts) {
        let sorted
        if(sort === "Newest") {
            sorted = posts.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
        } else if(sort === "Most Liked") {
            sorted = posts.sort((a, b) => b.likes - a.likes);
        } else if(sort === "Most Commented") {
            sorted = posts.sort((a, b) => b.comments.length - a.comments.length);
        }
        return sorted.filter(post => {
            const tags = filter?.toLowerCase().split(' ');
            if(tags[0]?.startsWith('author:')) {
                let author = tags[0].slice('author:'.length)
                tags.shift()
                let title = tags.join(" ")
                return post.title.toLowerCase().includes(title.toLowerCase())
                        && post.author.toLowerCase() === author.toLowerCase()
            }
            return post.title.toLowerCase().includes(filter?.toLowerCase())
                    || post.author.toLowerCase().includes(filter?.toLowerCase())
        });
    }

    function handleUpdateFilter(event) {
        setFilter(event.target.value);
    }

    return (
        <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" alignItems="flex-end">
                <Typography variant="h2" align="left" sx={{ mx: 6, my: 6 }} color='#E3256B'>
                    Discuss!
                </Typography>
                <Typography variant="h3" align="left" sx={{ mx: 6, my: 6 }} color='#000000' flexGrow={1}>
                    {handleSortAndFilter(props.posts).length}
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
                        placeholder="Search Posts..."
						style = {{ width: '75%' }}
                        value={filter}
                        onChange={handleUpdateFilter}
					/>
				</Box>
                <Button 
                    variant="contained"
                    sx={{ mx: 8, my: 6, color: 'white' }} 
                    style={{fontSize:'16pt', maxWidth: '135px', maxHeight: '50px', minWidth: '135px', minHeight: '50px'}} 
                    disableRipple
                    color='razzmatazz'
                    onClick={handleCreate}
                >
                    Create +
                </Button>
                <FormControl sx={{ ml: 1, mr: 6, my: 6, minWidth: 200 }}>
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
            </Box>
            <Box className="discussion-cards" display="flex" style={styles.scroll} >
                <List sx={{ width: '90%', left: '5%' }}>
                    {handleSortAndFilter(props.posts).map((post) => (
                            <DiscussionPostListCard 
                                post={post}
                            />
                        ))
                    }
                </List>
            </Box>                       
        </Box>
    )
}