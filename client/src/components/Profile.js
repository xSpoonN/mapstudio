/* import { useState } from 'react';
import MapCard from './MapCard';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'; */
import Box from '@mui/material/Box';
/* import Button from '@mui/material/Button'; */
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Container, Card, CardMedia, CardContent} from "@mui/material";

/* const maps = Array.from({ length: 8 }, (_, i) => `Your Map ${i + 1}`);
const share = Array.from({ length: 8 }, () => ['Private', 'Public'][Math.floor(Math.random() * 2)]); */

export default function Profile() {
/*     const [filter, setFilter] = useState('None');
    const [sort, setSort] = useState('Newest');

    const handleSetFilter = (event) => {
        setFilter(event.target.value);
    };

    const handleSetSort = (event) => {
        setSort(event.target.value);
    }; */

    const styles = {
        card: {
            maxWidth: 500,
            borderRadius: 16, // Adjust the value to control the roundness of corners
            minWidth: 500,
            height: 600, // Set the height to a larger value
        },
        media: {
            height: 0,
            paddingTop: '50%', // 1:1 aspect ratio for the photo
            borderRadius: '50%',
            maxWidth: '50%',
            alignItems: 'center',
            margin: 'auto',
            marginTop: '64px',
            marginBottom: '64px'
        },
        profilename: {
            marginBottom: '32px'
        },
        profilebio: {
            margin: '32px'
        }
    }

    return (
        <Container maxWidth="lg" style={{ paddingTop: '64px' }}>
            <Box height="100vh">
                <Grid container spacing={3} height="100%">
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card style={styles.card}>
                                <CardMedia
                                    style={styles.media}
                                    image="https://source.unsplash.com/random/500x500"
                                    title="Profile Picture"
                                />
                                <CardContent>
                                    <Typography variant="h3" align="center" style={styles.profilename}>John Doe</Typography>
                                    <Typography variant="body1" align='center' style={styles.profilebio}>
                                        Biography goes here. Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box display="flex" flexDirection="row" alignItems="center">
                                        <Box display="flex" alignItems="flex-end">
                                            <Typography variant="h4" align="left" color='#E3256B'>Created Maps</Typography>
                                            <Typography variant="h5" align="left" sx={{ ml: 2 }} color='#000000' flexGrow={1}>8</Typography>
                                        </Box>
                                        {/* Map cards go here */}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="flex-end">
                                        <Typography variant="h4" align="left" color='#E3256B'>Discussion Posts</Typography>
                                        <Typography variant="h5" align="left" sx={{ ml: 2 }} color='#000000' flexGrow={1}>14</Typography>
                                    </Box>
                                    {/* Discussion cards go here */}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
