import { useContext } from 'react';
import GlobalStoreContext from '../store';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';

export default function DiscussionPostListCard(props) {
    const { store } = useContext(GlobalStoreContext);

    function handleDiscussionPost() {
        console.log("yello")
        store.changeToDiscussionPost();
    }

    return (
        <ListItem 
            className='list-card'
            sx={{ display: 'flex', flexDirection: 'column', p: 1 }}
            onClick={handleDiscussionPost}
        >
            <Box 
                sx={{ display: 'flex' }}
                style={{ width: '100%', fontSize: '36pt' }}
            >
                <Box sx={{ p: 1, flexGrow: 1, textOverflow: "ellipsis", overflow: "hidden" }} display="flex" alignItems="center">
                    <Typography variant="h3" >
                        {props.title}
                    </Typography>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton aria-label='select'>
                        <ArrowRightIcon style={{fontSize:'36pt'}} />
                    </IconButton>
                </Box>
            </Box>
            <Box 
                sx={{ display: 'flex' }}
                style={{ width: '100%', fontSize: '12pt', alignItems: 'center'}}
                >
                    <Box sx={{ p: 1, flexGrow: 1 }}>
                        <Typography>
                            <span>By</span>{' '}
                            <span style={{ color: '#e3256b' }}>Kenna McRichard</span>
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                        <CommentIcon style={{ color:'#e3256b' }} sx={{ mx: 1 }}/>
                        <Typography color='#e3256b'>
                            10
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                        <ThumbUpIcon style={{ color:'#e3256b' }} sx={{ mx: 1 }}/>
                        <Typography color='#e3256b'>
                            1000
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                        <ThumbDownIcon style={{ color:'#e3256b' }} sx={{ mx: 1 }} />
                        <Typography color='#e3256b'>
                            100
                        </Typography>
                    </Box>
                    <Box sx={{ p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                        <Typography color='#e3256b'>
                            Today 12:41
                        </Typography>
                    </Box>
                </Box>
        </ListItem> 
    )
}