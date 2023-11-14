import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Container, Card, CardMedia, CardContent} from "@mui/material";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MapCard from './MapCard';
import PostCard from './PostCard';
import { useContext } from 'react';
import { GlobalStoreContext } from '../store'

export default function Profile() {
    const { store } = useContext(GlobalStoreContext);
    const styles = { // Shaped by the hands of the gods, the hands of the devil, the hands of the self
        card: {
            maxWidth: 500, // Restricting the infinite, the unbounded, the unending
            borderRadius: 16, // Softening the edges of the world. Though it is a lie, it is a comforting one
            minWidth: 500, // The illusion of freedom, but you're trapped in a cell
            height: 650, // A fixed stage, unmoving, unchanging for all eternity
            alignItems: 'center', // The center of the universe, the center of the labyrinth
            margin: 'auto', // The center of the maze, the center of the storm
        },
        media: {
            height: 0, // When it all ends, we will return to the void, the singularity
            paddingTop: '50%', // Half of infinity, half of nothing, half of everything
            maxWidth: '50%', // The matching half, the other half, the missing half
            borderRadius: '50%', // A wheel, the ouroboros, the eternal dance of life, death, and rebirth
            alignItems: 'center', // The center of the universe, the center of the labyrinth
            margin: 'auto', // The center of the maze, the center of the storm
            marginTop: '64px', // The eye of the storm, the eye of the beholder
            marginBottom: '64px' // The beholder, the observer, the self
        },
        profilename: { // What is a name, but a mask for the soul?
            marginBottom: '32px' 
        },
        profilebio: { // What is a bio, but a lie for the heart?
            margin: '32px'
        }
    }

    return (
        // The container is the world, the universe, the multiverse, one that holds all and is held by none
        <Container maxWidth="ml" style={{ paddingTop: '64px' }}>
            <Box height="100%">
                <Grid container spacing={3} height="100%">
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card style={styles.card}>
                                <CardMedia
                                    style={styles.media}
                                    image="https://source.unsplash.com/random/500x500"
                                    title="Profile Picture"
                                />
                                <CardContent>
                                    <Typography variant="h3" align="center" style={styles.profilename}>John Doe</Typography>
                                    <Typography variant="body1" align='center' style={styles.profilebio}>
                                    They are a creature of duality, capable of both great compassion and terrible cruelty. They are said to be the source of both the greatest blessings and the most devastating curses. 
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box display="flex" flexDirection="row" alignItems="center">
                                        <Box display="flex" alignItems="flex-end">
                                            <Typography variant="h4" align="left" color='#E3256B'>Created Maps</Typography>
                                            <Typography variant="h5" align="left" sx={{ ml: 2 }} color='#000000' flexGrow={1}>8</Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" flexDirection="row" alignItems="center">
                                        {Array.from({ length: 3 }, (_, i) => (
                                            <Grid item xs={12} md={6} key={i} sx={{ margin: '8px' }}>
                                                <MapCard
                                                    name={`Your Map ${i + 1}`}
                                                    shared={['Private', 'Public'][1]}
                                                    style={{ width: '600px', height: '300px' }}
                                                />
                                            </Grid>
                                        ))}
                                        <ArrowRightIcon style={{ color:'grey', fontSize: '40px' }} mx={1} onClick={() => store.changeToPersonal()} />
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="flex-end">
                                        <Typography variant="h4" align="left" color='#E3256B'>Discussion Posts</Typography>
                                        <Typography variant="h5" align="left" sx={{ ml: 2 }} color='#000000' flexGrow={1}>14</Typography>
                                    </Box>
                                    <Box display="flex" flexDirection="row" alignItems="center">
                                        {Array.from({ length: 3 }, (_, i) => (
                                            <Grid item xs={12} md={6} key={i} sx={{ margin: '8px' }}>
                                                <PostCard
                                                    name={`Post ${i + 1}`}
                                                    shared={['Private', 'Public'][1]}
                                                    style={{ width: '600px', height: '300px' }}
                                                />
                                            </Grid>
                                        ))}
                                        <ArrowRightIcon style={{ color:'grey', fontSize: '40px' }} mx={1}/>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}