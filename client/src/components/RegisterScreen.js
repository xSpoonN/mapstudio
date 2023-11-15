import { useContext } from 'react';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import AccountModal from './AccountModal';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function RegisterScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        auth.registerUser(
            formData.get('username'),
            formData.get('email'),
            formData.get('password'),
        );
        store.changeToHome()
    };

    function handleLoginScreen() {
        store.changeToLogin();
    }

    function handleForgotScreen() {
        store.changeToForgot();
    }

    function handleOpenModal() {
        store.openModal();
    }

    return (
        <Box
            sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            flex={1}
        >
            <AccountModal/>
            <Typography variant="h2" color='#E3256B'>
                Create Account
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} width='500px' 
                sx={{    
                    mt: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    variant="outlined" 
                    sx={{
                        background: 'white',
                        borderRadius: '16px',
                        "& fieldset": { borderColor: 'black', borderRadius: '16px' },
                        "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                                borderColor: '#E3256B'
                            }
                        },
                        "& label.Mui-focused": {
                            color: '#E3256B'
                        }
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    variant="outlined" 
                    sx={{
                        background: 'white',
                        borderRadius: '16px',
                        "& fieldset": { borderColor: 'black', borderRadius: '16px' },
                        "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                                borderColor: '#E3256B'
                            }
                        },
                        "& label.Mui-focused": {
                            color: '#E3256B'
                        }
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    variant="outlined" 
                    sx={{
                        background: 'white',
                        borderRadius: '16px',
                        "& fieldset": { borderColor: 'black', borderRadius: '16px' },
                        "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                                borderColor: '#E3256B'
                            }
                        },
                        "& label.Mui-focused": {
                            color: '#E3256B'
                        }
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2,  color: 'white' }}
                    color='razzmatazz'
                    align='center'
                    onClick={handleOpenModal}
                >
                    Register
                </Button>
                <Grid container sx={{ my: 24 }}
                    align="center"
                >
                    <Grid item xs={6}>
                        <Typography className='link' variant="body2" onClick={handleForgotScreen}>
                            {"Forgot Password?"}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography className='link' variant="body2" onClick={handleLoginScreen}>
                            {"Log In"}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}