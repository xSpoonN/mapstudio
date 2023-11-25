import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

import { Card, CardContent, Typography, Box } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EditIcon from '@mui/icons-material/Edit';

export default function PostCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const styles = {
        card: {
            maxWidth: 400,
            height: 250,
            borderRadius: 16, // Adjust the value to control the roundness of corners
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        media: {
            height: 0,
            paddingTop: '100%', // 1:1 aspect ratio for the photo
            borderRadius: '16px 16px 0 0', // Rounded top corners
        },
        content: {
            padding: '16px',
        },
        counters: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        item: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        edited: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
    };

    let x = 
        <div style={styles.edited}>
            <Box style={styles.item}>
                <EditIcon style={{ color:'grey' }} mx={2}/>
                <Typography variant="caption" color="grey" mx={2}>
                    {formatDate(props.post.publishedDate)}
                </Typography>
            </Box>
            <Box style={styles.item}>
                <Typography variant="caption" color="grey" mx={2}>
                    {props.post.likes}
                </Typography>
                <ThumbUpIcon style={{ color:'grey' }} mx={2}/>
            </Box>
            <Box style={styles.item}>
                <Typography variant="caption" color="grey" mx={2}>
                    {props.post.dislikes}
                </Typography>
                <ThumbDownIcon style={{ color:'grey' }} mx={2}/>
            </Box>
        </div>

    function handleCardClick() {
        store.changeToDiscussionPost(props.post);
    }

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

        // If none of the above conditions match, return YYYY-MM-DD format
        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        const day = String(inputDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} ${inputDate.getHours()}:${String(inputDate.getMinutes()).padStart(2, '0')}`;
    }

    return (
        <Card className="post-card" style={styles.card} onClick={handleCardClick}>
            <CardContent style={styles.content}>
                <Typography variant="h4" component="div" 
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                        wordBreak: "break-word",
                    }}
                >
                    {props.post.title}
                </Typography>
            </CardContent>
            <CardContent style={styles.content}>
                <Typography variant="h6" component="div" color='#66bb6a' justifyContent='center'>
                    Public
                </Typography>   
                {/* props.hideTime ||  */x}
            </CardContent>
        </Card>
    );
}