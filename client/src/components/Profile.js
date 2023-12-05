import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Container, Card, CardMedia, CardContent} from "@mui/material";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MapCard from './MapCard';
import PostCard from './PostCard';
import { useContext, useState, useEffect, useRef } from 'react';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';

const SASTOKEN = 'sp=r&st=2023-11-18T22:00:55Z&se=2027-11-18T06:00:55Z&sv=2022-11-02&sr=c&sig=qEnsBbuIbbJjSfAVO0rRPDMb5OJ9I%2BcTKDwpeQMtvbQ%3D';

export default function Profile() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [file, setFile] = useState(null); // eslint-disable-line
    const fileRef = useRef(null);
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState('');
    const [posts, setPosts] = useState(null);
    const [maps, setMaps] = useState(null);
    const styles = { // Shaped by the hands of the gods, the hands of the devil, the hands of the self
        card: {
            maxWidth: 500, // Restricting the infinite, the unbounded, the unending
            borderRadius: 16, // Softening the edges of the world. Though it is a lie, it is a comforting one
            minWidth: 500, // The illusion of freedom, but you're trapped in a cell
            height: 700, // A fixed stage, unmoving, unchanging for all eternity
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
            marginBottom: '64px', // The beholder, the observer, the self
            filter: 'blur(0)', // Initial blur value
            transition: 'filter 0.3s ease-in-out', // Transition effect
            '&:hover': {
                filter: 'blur(5px)', // Blur value on hover
            },
        },
        profilename: { // What is a name, but a mask for the soul?
            marginBottom: '32px' 
        },
        profilebio: { // What is a bio, but a lie for the heart?
            margin: '32px'
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            /* if (user) return; */
            const resp = await auth.getUserData(auth.getUser().email);
            /* console.log(resp); */
            if (resp.success) setUser(resp.user);
            const posts = await store.getPostsData(resp.user);
            /* console.log(posts); */
            setPosts(posts);
            const maps = await store.getMapsData(resp.user);
            /* console.log(maps); */
            setMaps(maps);
        }
        /* if (user === null)  */fetchUser();
    }, [auth, store])

    const handleUpload = async () => {
        /* console.log(fileRef.current.files[0]); */
        const formData = new FormData();
        formData.append('profilePicture', fileRef.current.files[0]);
        await auth.setProfilePicture(formData);
        setUser(null);
        store.openModal();
    }

    const handleBio = async (e) => {
        setIsEditing(false);
        await auth.setBio(bio);
    }

    function handleMorePosts() {
        store.changeToDiscussionHome("author:" + user.username)
    }

    function moreButton(){
        if(posts?.length >= 3) {
            return (
                <Box display="flex" alignItems="center">
                    <ArrowRightIcon style={{ color:'grey', fontSize: '40px' }} mx={1} onClick={handleMorePosts} />
                </Box>
            )
        } else {
            return <></>
        }
    }

    function MOREbUTTON(){
        if(maps?.length > 3) {
            return (
                <Box display="flex" alignItems="center">
                    <ArrowRightIcon style={{ color:'grey', fontSize: '40px' }} mx={1} onClick={() => store.changeToPersonal()} />
                </Box>
            )
        } else {
            return <></>
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
                                    image={user?.pfp ? `${user.pfp}?${SASTOKEN}` : "/static/images/avatar/2.jpg"}
                                    title="Profile Picture"
                                    onClick={() => fileRef.current.click()}
                                />
                                <CardContent>
                                    <Typography variant="h3" align="center" style={styles.profilename}>{user?.username || ''}</Typography>
                                    <Typography variant="body1" align='center' style={styles.profilebio}>
                                    {isEditing ? (
                                        <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} onBlur={handleBio}/>
                                    ) : (<div onDoubleClick={()=>setIsEditing(true)}>
                                            {bio || user?.bio || 'No Bio Set.'}
                                        </div>
                                    )}
                                    </Typography>
                                </CardContent>
                                
                                <input type="file" id='file' ref={fileRef} style={{display: 'none'}} onChange={(e) => { setFile(e.target.files[0]); handleUpload();}} />
                                {/* <button onClick={handleUpload}>Upload</button>  */}
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box display="flex" flexDirection="row" alignItems="center">
                                        <Box display="flex" alignItems="flex-end">
                                            <Typography variant="h4" align="left" color='#E3256B'>Created Maps</Typography>
                                            <Typography variant="h5" align="left" sx={{ ml: 2 }} color='#000000' flexGrow={1}>{maps?.length}</Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" flexDirection="row" alignItems="center">
                                        {Array.from({ length: Math.min(maps?.length, 3)}, (_, i) => (
                                            <Grid item xs={12} md={6} key={i} sx={{ margin: '8px' }}>
                                                <MapCard
                                                    mapID={maps[i]._id}
                                                    name={maps[i].title}
                                                    shared={maps[i].isPublished ? 'Public' : 'Private'}
                                                    // shared={['Private', 'Public'][maps[i].isPublished ? 1 : 0]}
                                                    lastEdited={maps[i].updateDate}
                                                    style={{ width: '600px', height: '300px' }}
                                                    views={maps[i].__v}
                                                    likes={maps[i].likes}
                                                    dislikes={maps[i].dislikes}
                                                    comments={maps[i].comments.length}
                                                />
                                            </Grid>
                                        ))}
                                        {MOREbUTTON()}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="flex-end">
                                        <Typography variant="h4" align="left" color='#E3256B'>Discussion Posts</Typography>
                                        <Typography variant="h5" align="left" sx={{ ml: 2 }} color='#000000' flexGrow={1}>{user?.posts?.length}</Typography>
                                    </Box>
                                    <Box display="flex" flexDirection="row" >
                                        {Array.from({ length: posts?.length }, (_, i) => (
                                            <Grid item xs={12} md={6} key={i} sx={{ margin: '8px' }}>
                                                <PostCard
                                                    post={posts[i]}
                                                />
                                            </Grid>
                                        ))}
                                        {moreButton()}
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
