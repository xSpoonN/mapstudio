import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AppBanner from './AppBanner';
import LandingWrapper from './LandingWrapper';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import RecoverPasswordScreen from './RecoverPasswordScreen';
import LoginScreen from './LoginScreen';
import SearchScreen from './SearchScreen';
import PersonalMapsScreen from './PersonalMapsScreen';
import Profile from './Profile';
import Barebones from './Barebones';
import DiscussionHomeScreen from './DiscussionHomeScreen';
import DiscussionPostNew from './DiscussionPostNew';
import DiscussionPost from './DiscussionPost';
import MapView from './MapVew';
import EditMap from './EditMap';

import Box from '@mui/material/Box';


export default function MainScreen() {
    const { store } = useContext(GlobalStoreContext);

    let Content
    switch (store.currentScreen) {
        case 'barebones':
            Content = <Barebones />
            break;
        case 'landing':
            Content = <LandingWrapper />
            break;
        case 'login':
            Content = <LoginScreen />
            break;
        case 'register':
            Content = <RegisterScreen />
            break;
        case 'forgot':
            Content = <ForgotPasswordScreen />
            break;
        case 'recover':
            Content = <RecoverPasswordScreen />
            break;
        case 'search':
            Content = <SearchScreen search={store.searchTerm} />
            break;
        case 'personal':
            Content = <PersonalMapsScreen />
            break;
        case 'discussionHome':
            Content = <DiscussionHomeScreen posts={store.discussionPosts} filter={store.currentFilter} />
            break;
        case 'discussionPostNew':
            Content = <DiscussionPostNew />
            break;
        case 'discussionPost':
            Content = <DiscussionPost post={store.currentPost} comments={store.currentComments} />
            break;
        case 'mapView':
            Content = <MapView mapid={store.currentMap}/>
            break;
        case 'profile':
            Content = <Profile />
            break;
        case 'editMap':
            Content = <EditMap mapid={store.currentMap} />
            break;
        default:
            Content = <></>
    }

    return (
        <Box height='100vh' display="flex" flexDirection="column">
            <AppBanner />
            {Content}
        </Box>
    )
}