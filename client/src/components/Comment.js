import { useContext } from 'react';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Avatar from '@mui/material/Avatar';

export default function Comment(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let comment = props.comment
    let date = formatDate(comment.publishedDate)

    function formatDate(dateString) {
        const currentDate = new Date();
        const inputDate = new Date(dateString);

        // Check if the input date is today
        if (
            inputDate.getDate() === currentDate.getDate() &&
            inputDate.getMonth() === currentDate.getMonth() &&
            inputDate.getFullYear() === currentDate.getFullYear()
        ) {
            return `Today ${inputDate.getHours()}:${String(inputDate.getMinutes()).padStart(2, '0')}`;
        }

        // Check if the input date is yesterday
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);
        if (
            inputDate.getDate() === yesterday.getDate() &&
            inputDate.getMonth() === yesterday.getMonth() &&
            inputDate.getFullYear() === yesterday.getFullYear()
        ) {
            return `Yesterday ${inputDate.getHours()}:${String(inputDate.getMinutes()).padStart(2, '0')}`;
        }

        // Check if the input date is within the past week
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const daysAgo = Math.floor((currentDate - inputDate) / millisecondsPerDay);
        if (daysAgo <= 6) {
            return `${daysAgo} days ago ${inputDate.getHours()}:${String(inputDate.getMinutes()).padStart(2, '0')}`;
        }

        // If none of the above conditions match, return YYYY-MM-DD format
        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        const day = String(inputDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} ${inputDate.getHours()}:${String(inputDate.getMinutes()).padStart(2, '0')}`;
    }

    function handleLike(event) {
        if(auth.user !== null) {
            store.likeComment(comment);
        }
    }

    function handleDislike(event) {
        if(auth.user !== null) {
            store.dislikeComment(comment);
        }
    }

    function handleLikeCounter() {
        if(auth.user && comment.likeUsers.includes(auth.user.username)) {
            return (
                <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <ThumbUpIcon sx={{ mx: 1 }} style={{ color:'#81c784' }} onClick={handleLike} />
                    <Typography>
                        {comment.likes}
                    </Typography>
                </Box>
            )
        } else {
            return (
                <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <ThumbUpIcon sx={{ mx: 1 }} onClick={handleLike} />
                    <Typography>
                        {comment.likes}
                    </Typography>
                </Box>
            )
        }
    }

    function handleDislikeCounter() {
        if(auth.user && comment.dislikeUsers.includes(auth.user.username)) {
            return (
                <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <ThumbDownIcon style={{ color:'#e57373' }} sx={{ mx: 1 }} onClick={handleDislike} />
                        <Typography color='#e57373'>
                            {comment.dislikes}
                        </Typography>
                    </Box>
            )
        } else {
            return (
                <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <ThumbDownIcon sx={{ mx: 1 }} onClick={handleDislike} />
                    <Typography>
                        {comment.dislikes}
                    </Typography>
                </Box>
            )
        }
    }

    return (
        <ListItem 
            className='comment-card'
            sx={{ display: 'flex', flexDirection: 'column', p: 1 }}
        >
            <Box 
                sx={{ display: 'flex' }}
                style={{ width: '100%', fontSize: '36pt' }}
            >
                <Box sx={{ p: 1, flexGrow: 1, textOverflow: "ellipsis", overflow: "hidden" }} display="flex" alignItems="center">
                    <Typography variant="h6" >
                        {comment.content}
                    </Typography>
                </Box>
            </Box>
            <Box 
                sx={{ display: 'flex' }}
                style={{ width: '100%', fontSize: '12pt', alignItems: 'center'}}
            >
                    <Box sx={{ display: 'flex', p: 1, flexGrow: 1 }} alignItems="center">
                        <Avatar alt="Kenna McRichard" src="/static/images/avatar/2.jpg" sx={{ bgcolor: "#E3256B", width: '32px', height: '32px', mr: 2 }} /> 
                        <Typography color='#e3256b'>
                            {comment.author}
                        </Typography>
                    </Box>
                    {handleLikeCounter()}
                    {handleDislikeCounter()}
                    <Box sx={{ p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                        <Typography color='#e3256b'>
                            {date}
                        </Typography>
                    </Box>
                </Box>
        </ListItem> 
    )
}