import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

export default function MapCard(props) {
    const styles = {
        card: {
            maxWidth: 400,
            borderRadius: 16, // Adjust the value to control the roundness of corners
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
        }
    };

    let x = <></>
    if(props.shared) {
        x = 
            <Typography variant="h6" component="div" color={props.shared === 'Public' ? '#66bb6a' : (props.shared === 'Private' ? '#ef5350' : undefined)}>
                {props.shared}
            </Typography>   
    }

    return (
        <Card style={styles.card}>
            <CardMedia
                style={styles.media}
                image='https://source.unsplash.com/random/500x500'
                title="Card Image"
            />
            <CardContent style={styles.content}>
                <Typography variant="h6" component="div">
                    {props.name}
                </Typography>
                {x}
                <div style={styles.counters}>
                    <Box style={styles.item}>
                        <Typography variant="caption" color="grey" mx={1}>
                            {Math.floor(Math.random() * 1000)}
                        </Typography>
                        <VisibilityIcon style={{ color:'grey' }} mx={1}/>
                    </Box>
                    <Box style={styles.item}>
                        <Typography variant="caption" color="grey" mx={1}>
                            {Math.floor(Math.random() * 500)}
                        </Typography>
                        <ThumbUpIcon style={{ color:'grey' }} mx={1}/>
                    </Box>
                    <Box style={styles.item}>
                        <Typography variant="caption" color="grey" mx={1}>
                            {Math.floor(Math.random() * 100)}
                        </Typography>
                        <ThumbDownIcon style={{ color:'grey' }} mx={1}/>
                    </Box>
                </div>
            </CardContent>
        </Card>
    );
}