import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Avatar from '@mui/material/Avatar';

export default function Comment(props) {

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
                        {props.title}
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
                            Kenna McRichard
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