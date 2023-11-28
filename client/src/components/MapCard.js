import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EditIcon from '@mui/icons-material/Edit';

export default function MapCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const styles = {
        card: {
            maxWidth: 400,
            borderRadius: 16, // Adjust the value to control the roundness of corners
        },
        media: {
            height: 0,
            paddingTop: '60%', // 1:1 aspect ratio for the photo
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

    let x = 
        <div style={styles.counters}>
            <Box style={styles.item}>
                <Typography variant="caption" color="grey" mx={1}>
                    {props.views}
                </Typography>
                <VisibilityIcon style={{ color:'grey' }} mx={1}/>
            </Box>
            <Box style={styles.item}>
                <Typography variant="caption" color="grey" mx={1}>
                    {props.likes}
                </Typography>
                <ThumbUpIcon style={{ color:'grey' }} mx={1}/>
            </Box>
            <Box style={styles.item}>
                <Typography variant="caption" color="grey" mx={1}>
                    {props.dislikes}
                </Typography>
                <ThumbDownIcon style={{ color:'grey' }} mx={1}/>
            </Box>
        </div>
        
    if(props.shared === "Private") {
        x = 
            <div style={styles.edited}>
                <Box style={styles.item}>
                    <EditIcon style={{ color:'grey' }} mx={1}/>
                    <Typography variant="caption" color="grey" mx={1}>
                        {formatDate(props.lastEdited)}
                    </Typography>
                </Box>
            </div>
    }

    function handleCardClick() {
        if(props.redirect === "edit") {
            store.changeToEditMap();
        } else {
            console.log('handleCardClick: ' + props.mapID)
            store.changeToMapView(props.mapID);
        }
    }

    return (
        <Card className="map-card" style={styles.card} onClick={handleCardClick}>
            <CardMedia
                style={styles.media}
                image='https://source.unsplash.com/random/500x300'
                title="Card Image"
            />
            <CardContent style={styles.content}>
                <Typography variant="h6" component="div">
                    {props.name}
                </Typography>
                <Typography variant="h6" component="div" color={props.shared === 'Public' ? '#66bb6a' : (props.shared === 'Private' ? '#ef5350' : undefined)}>
                    {props.shared}
                </Typography>   
                {/* props.hideTime ||  */x}
            </CardContent>
        </Card>
    );
}