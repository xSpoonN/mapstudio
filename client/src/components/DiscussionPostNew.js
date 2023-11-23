import { useState, useContext } from 'react';
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function DiscussionPostNew() {
    const { store } = useContext(GlobalStoreContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    function handleUpdateTitle(event) {
        setTitle(event.target.value);
    }

    function handleUpdateContent(event) {
        setContent(event.target.value);
    }

    function handlePost() {
        store.createNewPost(title, content);
    }

    return (
        <Box display="flex" flexDirection="column">
            <Typography variant="h2" align="left" sx={{ mx: 6, my: 6 }} color='#E3256B'>
                Create Discussion
            </Typography>
            <Box 
                style={{backgroundColor: '#CCCCCC', borderRadius: '8px'}}
                sx={{ mx: 6, p: 4 }}
            >
                <Box display="flex" flexDirection="row" alignItems='center'>
                    <Typography variant="h4" align="left" >
                        Title
                    </Typography>
                    <TextField
                        id="standard-basic"
                        variant="outlined" 
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
                            },
                            mx: 4
                        }}
                        style = {{ width: '75%' }}
                        inputProps={{style: {fontSize: 24}}}
                        value={title}
                        onChange={handleUpdateTitle}
                    />
                </Box>
                <Box display="flex" flexDirection="row" sx={{ my: 4}}>
                    <Typography variant="h4" align="left" >
                        Body&nbsp;
                    </Typography>
                    <TextField
                        id="standard-basic"
                        variant="outlined" 
                        multiline
                        rows={20}
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
                            },
                            mx: 4
                        }}
                        style = {{ width: '100%' }}
                        inputProps={{style: {fontSize: 24}}}
                        value={content}
                        onChange={handleUpdateContent}
                    />
                </Box>
                <Box display='flex' justifyContent='flex-end'>
                    <Button 
                        variant="contained"
                        sx={{ color: 'white', mx: 4 }} 
                        style={{fontSize:'16pt', maxWidth: '135px', maxHeight: '50px', minWidth: '135px', minHeight: '50px'}} 
                        disableRipple
                        color='razzmatazz'
                        onClick={handlePost}
                    >
                        Create +
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}