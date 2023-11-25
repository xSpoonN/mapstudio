import { useContext, useState, useRef, useEffect } from 'react';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import List from '@mui/material/List';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import IconButton from '@mui/material/IconButton';

import Comment from './Comment';

const SASTOKEN = 'sp=r&st=2023-11-18T22:00:55Z&se=2027-11-18T06:00:55Z&sv=2022-11-02&sr=c&sig=qEnsBbuIbbJjSfAVO0rRPDMb5OJ9I%2BcTKDwpeQMtvbQ%3D';
const styles = {
    scroll: {
        scrollbarWidth: 'thin'
    }
}

export default function DiscussionPost(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [comment, setComment] = useState('');
    const [user, setUser] = useState(null);
    const post = props.post
    const comments = props.comments
    const divRef = useRef(null);

    const inputDate = new Date(post.publishedDate);
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${inputDate.getHours()}:${String(inputDate.getMinutes()).padStart(2, '0')}`;

    useEffect(() => {
        divRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [post.comments.length]);

    useEffect(() => {
        const fetchUser = async () => {
            const resp = await auth.getUserById(post.authorId);
            console.log(resp);
            if (resp.success) setUser(resp.user);
        }
        fetchUser();
    }, [auth, post.authorId]);

    function handleLike(event) {
        if(auth.user !== null) {
            store.likePost();
        }
    }

    function handleDislike(event) {
        if(auth.user !== null) {
            store.dislikePost();
        }
    }

    function handleLikeCounter() {
        if(auth.user && post.likeUsers.includes(auth.user.username)) {
            return (
                <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <ThumbUpIcon sx={{ mx: 1 }} style={{ color:'#81c784' }} onClick={handleLike} />
                    <Typography>
                        {post.likes}
                    </Typography>
                </Box>
            )
        } else {
            return (
                <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <ThumbUpIcon sx={{ mx: 1 }} onClick={handleLike} />
                    <Typography>
                        {post.likes}
                    </Typography>
                </Box>
            )
        }
    }

    function handleDislikeCounter() {
        if(auth.user && post.dislikeUsers.includes(auth.user.username)) {
            return (
                <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <ThumbDownIcon sx={{ mx: 1 }} style={{ color:'#e57373' }} onClick={handleDislike} />
                    <Typography>
                        {post.dislikes}
                    </Typography>
                </Box>
            )
        } else {
            return (
                <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <ThumbDownIcon sx={{ mx: 1 }} onClick={handleDislike} />
                    <Typography>
                        {post.dislikes}
                    </Typography>
                </Box>
            )
        }
    }

    function handleUpdateComment(event) {
        setComment(event.target.value);
    }

    function handleComment() {
        if(auth.user) {
            store.createNewComment(comment);
            divRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setComment('');
    }

    return(
        <Box display="flex" flexDirection="column">
            <Box 
                style={{backgroundColor: '#DDDDDD', borderRadius: '8px'}}
                sx={{ m: 6, p: 4 }}
                height='30vh'
                display="flex" 
                flexDirection="row"
            >
                <Box 
                    style={{backgroundColor: '#CCCCCC', borderRadius: '8px', alignItems: 'center', justifyContent:"center"}}
                    sx={{ p: 4, aspectRatio: '1 / 1' }}
                    height="100%"
                    boxSizing="border-box"
                    display="flex" 
                    flexDirection="column"
                >
                    <Avatar 
                        alt="Kenna McRichard" 
                        src={user?.pfp ? `${user.pfp}?${SASTOKEN}` : "/static/images/avatar/2.jpg" }
                        sx={{ bgcolor: "#E3256B", width: '35%', height: '35%' }} 
                    />
                    <Typography variant="h4" sx={{ mt: 4 }} style={{ textAlign: 'center' }} color='#E3256B'>
                        {post.author}
                    </Typography>
                    <Typography variant="h6" flexGrow={1} color='#E3256B'>
                        {formattedDate}
                    </Typography>
                    <Box 
                        sx={{ display: 'flex' }}
                        style={{ fontSize: '12pt', alignItems: 'center'}}
                    >
                        <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                            <CommentIcon sx={{ mx: 1 }}/>
                            <Typography>
                                {post.comments.length}
                            </Typography>
                        </Box>
                        {handleLikeCounter()}
                        {handleDislikeCounter()}
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" sx={{ mx: 4 }} height="100%">
                    <Typography
                        variant="h4" 
                        sx={{ mb: 2, wordBreak: "break-word" }}
                    >
                        {post.title}
                    </Typography>
                    <Typography 
                        style={{
                            overflowY: 'auto',
                            scrollbarWidth: 'thin'
                        }}
                        sx={{ mb: 2 }}
                    >
                        {post.content}
                    </Typography>
                    
                </Box>
            </Box>
            <Box className="post-comments" display="flex" style={styles.scroll} sx={{ mb: 2 }}>
                <List sx={{ width: '90%', left: '5%' }}>
                    {comments.map((comment) => (
                            <Comment
                                comment={comment}
                            />
                        ))
                    }
                    <div ref={divRef} />
                </List>
            </Box> 
            <TextField
                id="standard-basic"
                variant="outlined"
                multiline
                rows={2}
                InputProps={{
                    endAdornment: (
                        <IconButton position="end" onClick={handleComment}>
                            <ArrowRightIcon/>
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
                style = {{ width: '90%', left: '5%' }}
                value={comment}
                onChange={handleUpdateComment}
			/>
        </Box>
    )
}