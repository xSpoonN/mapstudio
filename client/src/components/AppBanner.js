import { useState, useContext } from 'react';
import { GlobalStoreContext } from '../store'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

export default function AppBanner() {
	const { store } = useContext(GlobalStoreContext);
	const [anchorElUser, setAnchorElUser] = useState(null);

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handlePersonalMapScreen = () => {
		setAnchorElUser(null);
		store.changeToPersonal();
	};

	const handleProfileScreen = () => {
		setAnchorElUser(null);
		store.changeToProfile();
	}

	let loggedIn = true
	let x = 
		<Box sx={{ flexGrow: 0 }}>
			<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} className='account-circle'>
				<Avatar alt="Kenna McRichard" src="/static/images/avatar/2.jpg" />
			</IconButton>
			<Menu
				id="menu-appbar"
				anchorEl={anchorElUser}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}
				style={{zIndex: 8888}}
			>
				<MenuItem key="Profile" onClick={handleProfileScreen}>
						<Typography textAlign="center">Profile</Typography>
				</MenuItem>
				<MenuItem key="Personal Maps" onClick={handlePersonalMapScreen}>
						<Typography textAlign="center">Personal Maps</Typography>
				</MenuItem>
				<MenuItem key="Log Out" onClick={handleCloseUserMenu}>
					<Typography textAlign="center">Log Out</Typography>
				</MenuItem>
			</Menu>
		</Box>

	if (!loggedIn) {
		x = 
			<Box sx={{ flexGrow: 0 }}>
				<Button 
					endIcon={<ArrowDropDownIcon/>} 
					onClick={handleOpenUserMenu} 
					sx={{ my: 2, color: 'white' }} 
					style={{fontSize:'16pt', backgroundColor: 'transparent'}} 
					disableRipple
				>
					Log In
				</Button>
				<Menu
				id="menu-appbar"
				anchorEl={anchorElUser}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}
				style={{zIndex: 8888}}
				>
					<MenuItem key="Log In" onClick={handleCloseUserMenu}>
							<Typography textAlign="center">Log In</Typography>
					</MenuItem>
					<MenuItem key="Create Account" onClick={handleCloseUserMenu}>
							<Typography textAlign="center">Create Account</Typography>
					</MenuItem>
					<MenuItem key="Forgot Account?" onClick={handleCloseUserMenu}>
						<Typography textAlign="center">Forgot Account?</Typography>
					</MenuItem>
				</Menu>
			</Box>
	}

	function handleLogo() {
        store.changeToHome();
    }

	function handleSearch() {
		store.changeToSearch();
	}

	function handleBrowse() {
		store.changeToSearch();
	}

	function handleDiscuss() {
		store.changeToDiscussionHome();
	}

	return (
		<AppBar position="static" style={{ background: '#E3256B', zIndex: 7777}} elevation={0}>
			<Toolbar>
				<Box sx={{ display: { xs: 'none', md: 'flex' } }} paddingX={2}>
					<img src="/Logo.png" alt="Mapstudio Logo" width="200" height="auto" className="logo" onClick={handleLogo}/>
				</Box>	

				<Box sx={{ display: { xs: 'none', md: 'flex' } }} paddingX={2} justifyContent='center'>
					<Button
						sx={{ my: 2, color: 'white', display: 'block',  mx: 6}}
						style={{fontSize:'16pt', backgroundColor: 'transparent'}}
						disableRipple
						onClick={handleBrowse}
					>
						Browse
					</Button>
					<Button
						sx={{ my: 2, color: 'white', display: 'block',  mx: 6}}
						style={{fontSize:'16pt', backgroundColor: 'transparent'}}
						disableRipple
					>
						Create
					</Button>
					<Button
						sx={{ my: 2, color: 'white', display: 'block',  mx: 6}}
						style={{fontSize:'16pt', backgroundColor: 'transparent'}}
						disableRipple
						onClick={handleDiscuss}
					>
						Discuss
					</Button>
				</Box>

				<Box justifyContent="center" sx={{ flexGrow: 2, display: { xs: 'none', md: 'flex' } }}>
					<TextField
						id="standard-basic"
						variant="outlined" 
						InputProps={{
							endAdornment: (
									<IconButton position="end" onClick={handleSearch}>
											<SearchIcon/>
									</IconButton>
							),
							style: {fontSize: '14pt'}
						}}
						sx={{
							background: 'white',
							borderRadius: '16px',
							"& fieldset": { borderRadius: '16px' },
							'&:hover fieldset': {
								border: 'none'
							},
							"& .MuiOutlinedInput-root": {
								"&.Mui-focused fieldset": {
								  border: 'none'
								}
							}
						}}
						style = {{ width: '50%' }}
					/>
				</Box>

				{x}
			</Toolbar>
		</AppBar>
	);
}
