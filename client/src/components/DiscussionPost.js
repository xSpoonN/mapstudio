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

const posts = Array.from({ length: 10 }, (_, i) => `Comment ${i + 1}`);

const styles = {
    scroll: {
        scrollbarWidth: 'thin'
    }
}

export default function DiscussionPost() {
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
                    <Avatar alt="Kenna McRichard" src="/static/images/avatar/2.jpg" sx={{ bgcolor: "#E3256B", width: '35%', height: '35%' }} />
                    <Typography variant="h4" sx={{ mt: 4 }} style={{ textAlign: 'center' }} color='#E3256B'>
                        Kenna McRichard
                    </Typography>
                    <Typography variant="h6" flexGrow={1} color='#E3256B'>
                        Today 12:41
                    </Typography>
                    <Box 
                        sx={{ display: 'flex' }}
                        style={{ fontSize: '12pt', alignItems: 'center'}}
                    >
                        <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                            <CommentIcon sx={{ mx: 1 }}/>
                            <Typography>
                                10
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                            <ThumbUpIcon sx={{ mx: 1 }}/>
                            <Typography>
                                1000
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                            <ThumbDownIcon sx={{ mx: 1 }} />
                            <Typography>
                                100
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" sx={{ mx: 4 }} height="100%">
                    <Typography
                        variant="h4" 
                        sx={{ mb: 2, wordBreak: "break-word" }}
                    >
                        Anyone have any maps regarding the Ming Dynasty of China???????????????????????????????
                    </Typography>
                    <Typography 
                        style={{
                            overflowY: 'auto',
                            scrollbarWidth: 'thin'
                        }}
                        sx={{ mb: 2 }}
                    >
                        Hello fellow cartography enthusiasts! I hope you're all doing well. I've been working on a research project focused on the Ming Dynasty of China, and I'm currently on the lookout for some detailed maps that can help me gain a 
                        deeper understanding of the Ming Dynasty's territorial extent, administrative divisions, and cultural heritage sites. Since this forum has been an incredible resource for map enthusiasts like myself, I thought I'd reach out and 
                        see if anyone here might have or know where I can find some valuable maps related to the Ming Dynasty. Specifically, I'm interested in maps that showcase:
                        Ming Dynasty Borders: I'd love to explore maps that depict the Ming Dynasty's boundaries during different periods of its rule, including any notable territorial changes.
                        Administrative Divisions: Detailed maps showcasing the Ming Dynasty's administrative regions, provinces, and capitals would be incredibly helpful for my research.
                        Cultural and Historical Sites: If there are maps highlighting important cultural and historical sites from the Ming Dynasty era, such as the Great Wall, the Forbidden City, or famous temples and cities, those would be fantastic to study.
                        Trade Routes: Maps illustrating the trade routes, both overland and maritime, that were significant during the Ming Dynasty would add depth to my project.
                        Cartography of the Time: I'm also interested in seeing how cartography itself evolved during the Ming Dynasty, so any maps created during that era would be a treasure.
                        Hello fellow cartography enthusiasts! I hope you're all doing well. I've been working on a research project focused on the Ming Dynasty of China, and I'm currently on the lookout for some detailed maps that can help me gain a 
                        deeper understanding of the Ming Dynasty's territorial extent, administrative divisions, and cultural heritage sites. Since this forum has been an incredible resource for map enthusiasts like myself, I thought I'd reach out and 
                        see if anyone here might have or know where I can find some valuable maps related to the Ming Dynasty. Specifically, I'm interested in maps that showcase:
                        Ming Dynasty Borders: I'd love to explore maps that depict the Ming Dynasty's boundaries during different periods of its rule, including any notable territorial changes.
                        Administrative Divisions: Detailed maps showcasing the Ming Dynasty's administrative regions, provinces, and capitals would be incredibly helpful for my research.
                        Cultural and Historical Sites: If there are maps highlighting important cultural and historical sites from the Ming Dynasty era, such as the Great Wall, the Forbidden City, or famous temples and cities, those would be fantastic to study.
                        Trade Routes: Maps illustrating the trade routes, both overland and maritime, that were significant during the Ming Dynasty would add depth to my project.
                        Cartography of the Time: I'm also interested in seeing how cartography itself evolved during the Ming Dynasty, so any maps created during that era would be a treasure.
                    </Typography>
                    
                </Box>
            </Box>
            <Box className="post-comments" display="flex" style={styles.scroll} sx={{ mb: 2 }}>
                <List sx={{ width: '90%', left: '5%' }}>
                    {posts.map((post) => (
                            <Comment
                                title={post}
                            />
                        ))
                    }
                </List>
            </Box> 
            <TextField
                id="standard-basic"
                variant="outlined"
                multiline
                rows={2}
                InputProps={{
                    endAdornment: (
                        <IconButton position="end">
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
			/>
        </Box>
    )
}