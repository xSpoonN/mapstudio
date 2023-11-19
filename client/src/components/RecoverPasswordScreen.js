import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import AccountModal from './AccountModal';
import {Box, Button, TextField, Typography} from '@mui/material';

export default function RecoverPasswordScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext)
    const [error, setError] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (pass !== confirmPass) return setError('Passwords do not match');
        setError('');
        const resp = await auth.resetPassword(event.target.pass.value);
        if (!resp.success) return /* setError(resp.message); */ console.log(resp);
        console.log(resp);
        store.openModal();

        //const formData = new FormData(event.currentTarget);
    };

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
                New Password
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
                    id="pass"
                    label="New Password"
                    name="pass"
                    autoComplete="pass"
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
                    onChange={(e) => setPass(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="confirmPass"
                    label="Confirm Password"
                    name="confirmPass"
                    autoComplete="confirmPass"
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
                    onChange={(e) => setConfirmPass(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2,  color: 'white' }}
                    color='razzmatazz'
                    align='center'
                    disabled={pass === '' || confirmPass === ''}
                >
                    Confirm
                </Button>
                {error && <Typography variant="body2" color='red'>
                    {error}
                </Typography>}
            </Box>
        </Box>
    );
}