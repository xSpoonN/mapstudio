import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';

import MapCard from './MapCard';

const popularMaps = Array.from({ length: 4 }, (_, i) => `Popular Map ${i + 1}`);
const newMaps = Array.from({ length: 4 }, (_, i) => `New Map ${i + 1}`);
const yourMaps = Array.from({ length: 4 }, (_, i) => `Your Map ${i + 1}`);

export default function LandingWrapper() {
    const { store } = useContext(GlobalStoreContext);
    const [loggedIn, setLoggedIn] = useState(false);

    function handleLoginScreen() {
        store.changeToLogin();
    }

    function handleRegisterScreen() {
        store.changeToRegister();
    }

    function switchLogin() {
        setLoggedIn(!loggedIn)
    }

    let x = 
        <Box>
            <Typography variant="h1" sx={{ my: 4, mx: 16 }} color='#E3256B'>
                Welcome back Kenna!
            </Typography>
            <Typography variant="h4" sx={{ my: 4, mx: 16 }}>
                Continue Editing?
            </Typography>
            <Grid container
                spacing={0}
                direction="row"
                alignItems="center"
                justify="center"
                flexGrow={1}
            >
                {yourMaps.map((map) => (
                    <Grid item lg={3} md={4} sm={6} xs={12} align="center" sx={{ my: 4 }}>
                        <MapCard name={map} redirect="edit" shared="Private"/>
                    </Grid>   
                ))}
            </Grid>
            <Typography variant="h4" sx={{ my: 4, mx: 16 }}>
                Explore popular maps:
            </Typography>
            <Grid container
                spacing={0}
                direction="row"
                alignItems="center"
                justify="center"
                flexGrow={1}
            >
                {popularMaps.map((map) => (
                    <Grid item lg={3} md={4} sm={6} xs={12} align="center" sx={{ my: 4 }}>
                        <MapCard name={map}/>
                    </Grid>   
                ))}
            </Grid>
            <Typography variant="h4" sx={{ my: 4, mx: 16 }}>
                Explore new maps:
            </Typography>
            <Grid container
                spacing={0}
                direction="row"
                alignItems="center"
                justify="center"
                flexGrow={1}
            >
                {newMaps.map((map) => (
                    <Grid item lg={3} md={4} sm={6} xs={12} align="center" sx={{ my: 4 }}>
                        <MapCard name={map}/>
                    </Grid>   
                ))}
            </Grid>
            <Box>
                <Typography onClick={switchLogin}>
                    Switch
                </Typography>
            </Box>
        </Box>

    if (!loggedIn) {
        x = 
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
                    flexGrow={1}
                >
                    {newMaps.map((map) => (
                        <Grid item lg={3} md={4} sm={6} xs={12} align="center" sx={{ my: 4 }}>
                            <MapCard name={map}/>
                        </Grid>   
                    ))}
                </Grid>
                <Box position="absolute" bottom="0px">
                    <Typography onClick={switchLogin}>
                        Switch
                    </Typography>
                </Box>
            </Box>
    }

    return(
        <>
            {x}
        </>
    );
}