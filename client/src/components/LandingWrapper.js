import { useContext } from 'react';
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';

import MapCard from './MapCard';

const popularMaps = Array.from({ length: 4 }, (_, i) => `Popular Map ${i + 1}`);
//const newMaps = Array.from({ length: 4 }, (_, i) => `New Map ${i + 1}`);

export default function LandingWrapper() {
    const { store } = useContext(GlobalStoreContext);

    function handleLoginScreen() {
        store.changeToLogin();
    }

    function handleRegisterScreen() {
        store.changeToRegister();
    }

    return(
        <Box>
            <Typography variant="h1" align="center" sx={{ m: 6 }} color='#E3256B'>
                Welcome to MapStudio!
            </Typography>
            <Typography variant="h3" align="center" sx={{ m: 2 }}>
                Create and share maps!
            </Typography>
            <Typography variant="h3" align="center" sx={{ m: 2 }}>
                Discuss with the community!
            </Typography>
            <Box align="center">
                <Button 
                    variant="contained"
                    sx={{ mt: 6, mx: 8, color: 'white'}} 
                    style={{fontSize:'16pt'}} 
                    disableRipple
                    color='razzmatazz'
                    onClick={handleLoginScreen}
                >
                    Log In
                </Button>
                <Button 
                    variant="contained"
                    sx={{ mt: 6, mx: 8, color: 'white'}} 
                    style={{fontSize:'16pt'}} 
                    disableRipple
                    color='razzmatazz'
                    onClick={handleRegisterScreen}
                >
                    Register
                </Button>
            </Box>
            <Typography variant="h4" sx={{ my: 6, mx: 16 }}>
                Explore popular maps:
            </Typography>
            <Grid container
                spacing={0}
                direction="row"
                alignItems="center"
                justify="center"
            >
                {popularMaps.map((map) => (
                    <Grid item lg={3} md={4} sm={6} xs={12} align="center" sx={{ my: 4 }}>
                        <MapCard name={map}/>
                    </Grid>   
                ))}
            </Grid>
        </Box>
    );
}