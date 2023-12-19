import { useState, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'

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

const SASTOKEN = 'sp=r&st=2023-11-18T22:00:55Z&se=2027-11-18T06:00:55Z&sv=2022-11-02&sr=c&sig=qEnsBbuIbbJjSfAVO0rRPDMb5OJ9I%2BcTKDwpeQMtvbQ%3D';

export default function AppBanner() {
	const { store } = useContext(GlobalStoreContext);
	const { auth } = useContext(AuthContext);

	const [anchorElUser, setAnchorElUser] = useState(null);
	const [user, setUser] = useState(null);
	const [search, setSearch] = useState("")

	useEffect(() => {
		const fetchUser = async () => {
			const resp = await auth.getUserData(auth.getUser()?.email);
			/* console.log(resp); */
			if (resp?.success) setUser(resp.user);
		}
		fetchUser();
	}, [auth])

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
		store.changeToProfile(auth.getUser());
	}

	function handleLoginScreen() {
		setAnchorElUser(null);
        store.changeToLogin();
    }

	function handleRegisterScreen() {
		setAnchorElUser(null);
        store.changeToRegister();
    }

    function handleForgotScreen() {
		setAnchorElUser(null);
        store.changeToForgot();
    }

	function handleLogout() {
		setAnchorElUser(null);
		auth.logoutUser();
		store.changeToHome();
	}

	let x = 
		<Box sx={{ flexGrow: 0 }}>
			<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} className='account-circle'>
				<Avatar 
					alt="Kenna McRichard" 
					src={`${user?.pfp}?${SASTOKEN}`}
				>
					{user?.username[0]}
				</Avatar>
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
				<MenuItem key="Log Out" onClick={handleLogout}>
					<Typography textAlign="center">Log Out</Typography>
				</MenuItem>
			</Menu>
		</Box>

	if (!auth.loggedIn) {
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
					<MenuItem key="Log In" onClick={handleLoginScreen}>
							<Typography textAlign="center">Log In</Typography>
					</MenuItem>
					<MenuItem key="Create Account" onClick={handleRegisterScreen}>
							<Typography textAlign="center">Create Account</Typography>
					</MenuItem>
					<MenuItem key="Forgot Account?" onClick={handleForgotScreen}>
						<Typography textAlign="center">Forgot Account?</Typography>
					</MenuItem>
				</Menu>
			</Box>
	}

	function handleLogo() {
        store.changeToHome();
    }

	function handleSearch() {
		store.changeToSearch(search);
		setSearch("");
	}

	function handleBrowse() {
		store.changeToSearch();
	}

	async function handleCreate() {
		if(auth.user) {
			console.log("Recv create new map request");
			const authReq = await auth.getUserData(auth.user.email);
			let id = await store.createNewMap(authReq.user._id, 'New Map', 'Description');
			await store.changeToEditMap(id);
		} else {
			store.changeToLogin()
		}
	}

	function handleDiscuss() {
		store.changeToDiscussionHome();
	}

	function handleUpdateSearch(event) {
        setSearch(event.target.value);
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
                        onClick={handleCreate}
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
						onChange={handleUpdateSearch}
						value={search}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleSearch();
							}
						}}
					/>
				</Box>

				{x}
			</Toolbar>
		</AppBar>
	);
}
