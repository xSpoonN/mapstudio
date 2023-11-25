import React, { useEffect, useRef, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Button from '@mui/material/Button';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Comment from './Comment';
import { Typography } from '@mui/material';

const styles = {
    scroll: {
        scrollbarWidth: 'thin'
    }
}

const SASTOKEN = 'sp=r&st=2023-11-18T22:00:55Z&se=2027-11-18T06:00:55Z&sv=2022-11-02&sr=c&sig=qEnsBbuIbbJjSfAVO0rRPDMb5OJ9I%2BcTKDwpeQMtvbQ%3D';
export default function MapView({ mapid }) {
    const mapRef = useRef(null); // Track map instance
    const geoJSONLayerRef = useRef(null); // Track GeoJSON layer instance
    const mapInitializedRef = useRef(false); // Track whether map has been initialized
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const divRef = useRef(null);

    const [map, setMap] = useState(null);
    const [user, setUser] = useState(null);
    const [mapComments, setMapComments] = useState([]);
    const [comment, setComment] = useState('');
    useEffect(() => {
        divRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [mapComments.length]);
    useEffect(() => {
        if (!mapInitializedRef.current) { // Initialize map if it hasn't been initialized yet
            mapRef.current = L.map(mapRef.current).setView([0, 0], 2); // Initialize Leaflet map with default view/zoom
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current); // Add OpenStreetMap tiles
            mapInitializedRef.current = true; // Mark map as initialized
        }

        fetch("brazil-states.json")
            .then((response) => response.json())
            .then((geojson) => {
                if (geoJSONLayerRef.current) geoJSONLayerRef.current.clearLayers(); // Remove existing GeoJSON layer
                else geoJSONLayerRef.current = L.geoJSON(geojson).addTo(mapRef.current); // Add new GeoJSON layer
                geoJSONLayerRef.current.addData(geojson); // Add GeoJSON data to layer
            }).catch((error) => {
                console.error('Error reading GeoJSON', error);
            });

        return () => { if (geoJSONLayerRef.current) geoJSONLayerRef.current.clearLayers(); }; // Remove GeoJSON layer on unmount
    }, []);
    useEffect(() => {
        const fetchMap = async () => {
            const resp = await store.getMap('656258501ff509764ff362a8');
            if (resp) {
                console.log(resp);
                setMap(resp);
                const user = await auth.getUserById(resp.author);
                if (user?.success) setUser(user.user);
                const comments = await store.getMapComments(resp.comments);
                console.log(comments);
                if (comments?.success) setMapComments(comments.comments);
            }
        }
        fetchMap();
    }, [store, auth, mapid]);

    function handleLike() {
        if(auth.user !== null) {
            store.likeMap(map);
        }
    }

    function handleDislike() {
        if(auth.user !== null) {
            store.dislikeMap(map);
        }
    }

    function handleLikeCounter() {
        if(auth.user && map?.likeUsers?.includes(auth.user.username)) {
            return (
                <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <ThumbUpIcon sx={{ mx: 1 }} style={{ color:'#81c784' }} onClick={handleLike} />
                    <Typography>
                        {map?.likes}
                    </Typography>
                </Box>
            )
        } else {
            return (
                <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <ThumbUpIcon sx={{ mx: 1 }} onClick={handleLike} />
                    <Typography>
                        {map?.likes}
                    </Typography>
                </Box>
            )
        }
    }

    function handleDislikeCounter() {
        if(auth.user && map?.dislikeUsers?.includes(auth.user.username)) {
            return (
                <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <ThumbDownIcon style={{ color:'#e57373' }} sx={{ mx: 1 }} onClick={handleDislike} />
                        <Typography color='#e57373'>
                            {map?.dislikes}
                        </Typography>
                    </Box>
            )
        } else {
            return (
                <Box sx={{ display: 'flex', p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <ThumbDownIcon sx={{ mx: 1 }} onClick={handleDislike} />
                    <Typography>
                        {map?.dislikes}
                    </Typography>
                </Box>
            )
        }
    }

    function formatDate(dateString) {
        const inputDate = new Date(dateString);
        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        const day = String(inputDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} ${inputDate.getHours()}:${String(inputDate.getMinutes()).padStart(2, '0')}`;
    }

    function handleUpdateComment(event) {
        setComment(event.target.value);
    }

    async function handleComment() {
        if(auth.user) {
            console.log(map);
            await store.createMapComment(comment, map._id);
            const comments = await store.getMapComments(map.comments);
            console.log(comments);
            if (comments?.data.success) setMapComments(comments.data.comments);

            divRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setComment('');
    }

    return (
        <Box display="flex" flexDirection="row">
            <Box 
                style={{backgroundColor: '#DDDDDD', borderRadius: '8px'}}
                sx={{ mx: 2, my: 6, p:4 }}
                height='80vh'
                width='70vw'
            >
                <Box 
                    style={{backgroundColor: '#CCCCCC', borderRadius: '8px'}}
                    sx={{ p: 2, mb: 2 }}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                >
                    <Box display="flex" flexDirection="column" sx={{ ml: 2, maxWidth: '80%' }} flexGrow={1}>
                        <Typography variant="h3" color='#E3256B' sx={{ textOverflow: "ellipsis", overflow: "hidden" }} noWrap>
                            {map?.title}
                        </Typography>
                        <Box display="flex" flexDirection="row" alignItems="center" sx={{ mt: 1}}>
                            <Avatar 
                                alt="Kenna McRichard" 
                                src={user?.pfp ? `${user.pfp}?${SASTOKEN}` : "/static/images/avatar/2.jpg" }
                                sx={{ bgcolor: "#E3256B", width: '32px', height: '32px', mr: 1 }} 
                            /> 
                            <Typography>
                                {user?.username} | Published {formatDate(map?.creationDate)}
                            </Typography>
                        </Box>
                    </Box>
                    {handleLikeCounter()}
                    {handleDislikeCounter()}
                </Box>
                <Box display="flex">
                    <Button 
                        variant="contained"
                        sx={{ color: 'white', mr: 1 }} 
                        style={{fontSize:'16pt', maxWidth: '135px', maxHeight: '50px', minWidth: '135px', minHeight: '50px'}} 
                        disableRipple
                        color='razzmatazz'
                    >
                        JSON
                    </Button>
                    <Button 
                        variant="contained"
                        sx={{ color: 'white', mx: 1 }} 
                        style={{fontSize:'16pt', maxWidth: '135px', maxHeight: '50px', minWidth: '135px', minHeight: '50px'}} 
                        disableRipple
                        color='razzmatazz'
                    >
                        PNG
                    </Button>
                    <Button 
                        variant="contained"
                        sx={{ color: 'white', mx: 1 }} 
                        style={{fontSize:'16pt', maxWidth: '135px', maxHeight: '50px', minWidth: '135px', minHeight: '50px'}} 
                        disableRipple
                        color='razzmatazz'
                    >
                        JPG
                    </Button>
                    <Button 
                        variant="contained"
                        sx={{ color: 'white', marginLeft: 'auto' }} 
                        style={{fontSize:'16pt', maxWidth: '135px', maxHeight: '50px', minWidth: '135px', minHeight: '50px'}} 
                        disableRipple
                        color='razzmatazz'
                        alignItems='right'
                        onClick={() => store.changeToEditMap()}
                    >
                        Fork
                    </Button>
                </Box>
                <Box 
                    style={{backgroundColor: '#FFFFFF', borderRadius: '8px'}}
                    sx={{ p: 2, my: 2 }}
                    display="flex"
                    height='50vh'
                    flexDirection="row"
                    alignItems="center"
                    ref={mapRef}
                >
                </Box>
                <Box 
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    height="12vh"
                >
                    <Typography
                        style={{
                            overflowY: 'auto',
                            scrollbarWidth: 'thin'
                        }}
                        sx={{ m: 1 }}
                    >
                        {map?.description}
                    </Typography>
                </Box>
            </Box>
            <Box 
                style={{backgroundColor: '#DDDDDD', borderRadius: '8px'}}
                sx={{ mx: 2, my: 6, p: 4 }}
                height='80vh'
                width='30vw'
            >
                <Box display="flex" flexDirection="row" alignItems="flex-end">
                    <Typography variant="h4" sx={{ ml: 4, mb: 2 }} color='#E3256B'>
                        Comments
                    </Typography>
                    <Typography variant="h6" sx={{ ml: 2, mb: 2 }} >
                        {map?.comments.length}
                    </Typography>
                </Box>
                <Box className="map-comments" height="85%" style={styles.scroll} sx={{ mb: 2 }}>
                    <List sx={{ width: '90%', left: '5%' }}>
                        {mapComments?.map(async (cmt) => (
                                <Comment
                                    comment = {cmt}
                                />
                            ))
                        }
                        <div ref={divRef} />
                    </List>
                </Box> 
                <TextField
                    id="standard-basic"
                    variant="outlined"
                    multiline
                    rows={2}
                    InputProps={{
                        endAdornment: (
                            <IconButton position="end" onClick={handleComment}>
                                <ArrowRightIcon/>
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
                    style = {{ width: '90%', left: '5%' }}
                    value={comment}
                    onChange={handleUpdateComment}
			    />
            </Box>
        </Box>
    )
}