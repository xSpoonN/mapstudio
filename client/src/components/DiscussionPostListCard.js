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
    const post = props.post

    const inputDate = new Date(post.publishedDate);
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${inputDate.getHours()}:${String(inputDate.getMinutes()).padStart(2, '0')}`;

    function handleDiscussionPost() {
        store.changeToDiscussionPost(post);
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
                        {post.title}
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
                            <span style={{ color: '#e3256b' }}>{post.author}</span>
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                        <CommentIcon style={{ color:'#e3256b' }} sx={{ mx: 1 }}/>
                        <Typography color='#e3256b'>
                            {post.comments.length}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                        <ThumbUpIcon style={{ color:'#e3256b' }} sx={{ mx: 1 }}/>
                        <Typography color='#e3256b'>
                            {post.likes}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                        <ThumbDownIcon style={{ color:'#e3256b' }} sx={{ mx: 1 }} />
                        <Typography color='#e3256b'>
                            {post.dislikes}
                        </Typography>
                    </Box>
                    <Box sx={{ p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                        <Typography color='#e3256b'>
                            {formattedDate}
                        </Typography>
                    </Box>
                </Box>
        </ListItem> 
    )
}