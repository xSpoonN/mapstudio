import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import AccountModal from './AccountModal';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function ForgotPasswordScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext)
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Check if email is valid with regex
        if (!/\S+@\S+\.\S+/.test(event.target.email.value)) return setError('Invalid email address');
        setError('');
        const resp = await auth.forgotPassword(event.target.email.value, event.target.username.value);
        if (!resp.success) return /* setError(resp.message); */ console.log(resp);
        console.log(resp);
        handleOpenModal();

        //const formData = new FormData(event.currentTarget);
    };

    function handleRegisterScreen() {
        store.changeToRegister();
    }

    function handleLoginScreen() {
        store.changeToLogin();
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
                Forgot Account?
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
                    onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2,  color: 'white' }}
                    color='razzmatazz'
                    align='center'
                    disabled={email === '' || username === ''}
                    /* onClick={handleOpenModal} */
                >
                    Recover
                </Button>
                {error && <Typography variant="body2" color='red'>
                    {error}
                </Typography>}
                <Grid container sx={{ my: 24 }}
                    align="center"
                >
                    <Grid item xs={6}>
                        <Typography className='link' variant="body2" onClick={handleRegisterScreen}>
                            {"Create Account"}
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