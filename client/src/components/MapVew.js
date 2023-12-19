import React, { useEffect, useRef, useContext, useState } from 'react';
import { createRoot } from 'react-dom/client';
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
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

import Comment from './Comment';
import { Typography } from '@mui/material';

const styles = {
    scroll: {
        scrollbarWidth: 'thin'
    }
}
const formatLegend = (legend) => {
    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            minWidth: '150px',
            maxWidth: '300px',
            minHeight: '100px',
            backgroundColor: 'rgba(80,80,80, 0.7)',
            padding: '10px', 
            paddingRight: '20px',
            borderRadius: '5px'
        }}>
            <Typography variant="h5" sx={{color: '#FFFFFF', fontFamily: 'JetBrains Mono'}}>Legend</Typography>
            {legend}
        </Box>
    )
}
function interpolateColor(value, min, max, minColor, maxColor) {
    if (min === max) return maxColor;
    const normalizedValue = (value - min) / (max - min);
    const r = Math.round((1 - normalizedValue) * parseInt(minColor.slice(1, 3), 16) + normalizedValue * parseInt(maxColor.slice(1, 3), 16));
    const g = Math.round((1 - normalizedValue) * parseInt(minColor.slice(3, 5), 16) + normalizedValue * parseInt(maxColor.slice(3, 5), 16));
    const b = Math.round((1 - normalizedValue) * parseInt(minColor.slice(5, 7), 16) + normalizedValue * parseInt(maxColor.slice(5, 7), 16));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const SASTOKENICON = 'sp=r&st=2023-11-18T22:00:55Z&se=2027-11-18T06:00:55Z&sv=2022-11-02&sr=c&sig=qEnsBbuIbbJjSfAVO0rRPDMb5OJ9I%2BcTKDwpeQMtvbQ%3D';
const SASTOKENMAP = 'sp=r&st=2023-12-03T19:46:53Z&se=2025-01-09T03:46:53Z&sv=2022-11-02&sr=c&sig=LL0JUIq%2F3ZfOrYW8y4F4lk67ZXHFlGdmY%2BktKsHPkss%3D';
export default function MapView({ mapid }) {
    /* console.log('MAPID:::: ' + mapid) */
    const mapRef = useRef(null); // Track map instance
    const geoJSONLayerRef = useRef(null); // Track GeoJSON layer instance
    const mapInitializedRef = useRef(false); // Track whether map has been initialized
    const markerLayerRef = useRef(null); // Track marker featuregroup instance
    const [data, setData] = useState(null); // eslint-disable-line
    const [showSatellite, setShowSatellite] = useState(false);
    const satelliteLayerRef = useRef(null); // Track satellite layer instance
    const legendRef = useRef(null); // Track legend instance
    const [markers, setMarkers] = useState([]); // eslint-disable-line
    const [init, setInit] = useState(false)
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const divRef = useRef(null);
    const heatLayerRef = useRef(null);

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
            satelliteLayerRef.current = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{ 
                subdomains:['mt0','mt1','mt2','mt3']
            }).addTo(mapRef.current); // Add Google Satellite tiles
            mapInitializedRef.current = true; // Mark map as initialized
            const legend = L.control({position: 'bottomleft'}); // Initialize legend
            legend.onAdd = () => {
                const div = L.DomUtil.create('div', 'info legend');
                const root = createRoot(div);
                root.render(formatLegend())
                return div;
            }
            legend.addTo(mapRef.current); // Add legend to map
            legendRef.current = legend; // Store legend in ref
        }
        if (!markerLayerRef.current) markerLayerRef.current = L.featureGroup().addTo(mapRef.current);
        fetch(`${map?.mapFile}?${SASTOKENMAP}`, {mode: "cors"})
            .then((response) => response.json())
            .then((geojson) => {
                if (geoJSONLayerRef.current) geoJSONLayerRef.current.clearLayers(); // Remove existing GeoJSON layer
                else geoJSONLayerRef.current = L.geoJSON(geojson).addTo(mapRef.current); // Add new GeoJSON layer
                geoJSONLayerRef.current.addData(geojson); // Add GeoJSON data to layer
                /* console.log("map: " + map) */
            }).catch((error) => {
                console.error('Error reading GeoJSON', error);
            });

        satelliteLayerRef?.current?.setOpacity(showSatellite ? 1 : 0);
        setInit(true)
        return () => { if (geoJSONLayerRef.current) geoJSONLayerRef.current.clearLayers(); }; // Remove GeoJSON layer on unmount
    }, [map, showSatellite]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        const fetchMap = async () => {
            const resp = await store.getMap(mapid);
            if (resp) {
                /* console.log(resp); */
                setMap(resp);
                const user = await auth.getUserById(resp.author);
                if (user?.success) setUser(user.user);
                const comments = await store.getMapComments(resp);
                /* console.log(comments); */
                if (comments?.data.success) setMapComments(comments.data.comments);
                /* console.log(comments?.data.comments); */
                if (!resp.mapSchema) return setData({ // If map has no schema, create a new one
                    "type": "none",
                    "bins": [],
                    "subdivisions": [],
                    "points": [],
                    "gradients": [],
                    "showSatellite": false
                });
                const resp2 = await store.getSchema(resp.mapSchema, false);
                console.log(resp2);
                if (!resp2) return setData({ // If map has no schema, create a new one
                    "type": "none",
                    "bins": [],
                    "subdivisions": [],
                    "points": [],
                    "gradients": [],
                    "showSatellite": false
                });
                /* store.setSchemaData(resp2?.schema); */
                setData(resp2);

                // Draw subdivisions and points
                drawSubdivisions(resp2);
                loadPoints(resp2?.points);
                setShowSatellite(resp2?.showSatellite); // Set satellite view
                renderHeatSchemaToHeatMap(resp2);
                drawLegend(resp2);
            }
        }
        fetchMap();
    }, [store, auth, mapid, init]);

    const drawSubdivisions = (resp2) => {
        if (geoJSONLayerRef.current){
            geoJSONLayerRef.current.eachLayer((layer) => {
                const existing = resp2?.subdivisions?.find(subdivision => 
                    subdivision.name === layer.feature.properties.name || // All of these are for different capitalizations of the same property
                    subdivision.name === layer.feature.properties.NAME || // This is because different files use different capitalizations and javascript is case sensitive
                    subdivision.name === layer.feature.properties.Name
                );
                layer.setStyle({
                    fillColor: existing?.color || '#DDDDDD', 
                    fillOpacity: existing?.weight || 0.5,
                    weight: 1,
                    color: '#AAAAAA',
                }); // Set color and weight of subdivision
            } );
        }
        if (markerLayerRef?.current) markerLayerRef.current.bringToFront(); // Bring marker featureGroup to render in front
    }

    const loadPoints = (points) => {
        let newMarkers = []; // Store working set of markers, can't use state variable marker because it is snapshot
        markerLayerRef?.current?.clearLayers(); // Clear existing markers
        points?.forEach(point => {
            const marker = L.circleMarker([point.location.lat, point.location.lon], {
                radius: point.weight * 15
            }).addTo(markerLayerRef.current); // Add new marker
            marker.setStyle({fillColor: point.color || '#000000', fillOpacity: 1, stroke: false}); // Set color and size of marker
            marker.bindPopup(point.name);
            newMarkers.push(marker);
        })
        setMarkers(newMarkers); // Update state variable
    }

    function renderHeatSchemaToHeatMap(mapSchema) {
        if (mapSchema?.heatmaps?.length > 0) {
            const heatMap = mapSchema.heatmaps[0];
            const radius = heatMap.radius;
            const blur = heatMap.blur;
            const pointsArrayData = heatMap.points.map(point => [point.location.lat, point.location.lon, point.weight * 20]);
            if (heatLayerRef.current) {
                mapRef?.current?.removeLayer(heatLayerRef.current);
            }
            const heatLayer = L.heatLayer(pointsArrayData, { radius: radius, blur: blur }).addTo(mapRef.current);
            if(heatLayer) {
                heatLayerRef.current = heatLayer;
            }
        }
    }

    // Handles redrawing legend when schema is updated
    const drawLegend = (resp2) => {
        if (!legendRef.current) return;
        legendRef.current.remove();
        if(resp2?.bins.length === 0 && resp2?.gradients.length === 0) return;
        const legend = L.control({position: 'bottomleft'}); // Initialize legend
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            const root = createRoot(div);
            root.render(
                formatLegend(
                    [resp2?.bins?.map(bin => {
                        return (                        
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', overflow: '' }}>  
                            <Box sx={{ width: 22, minWidth: 22, height: 22, borderRadius: '5px', backgroundColor: bin.color, marginRight: '10px', marginLeft: '15px'}} />
                            <Typography sx={{ marginLeft: '5px', marginRight: 'auto', color: '#FFFFFF', fontFamily: 'JetBrains Mono'}} noWrap='true'>{bin.name}</Typography>
                        </Box>
                        )
                    }), 
                    ...(resp2?.gradients?.map(grd => {
                        const grdSubdivisions = resp2.subdivisions.filter(subdivision => grd.subdivisions?.includes(subdivision.name));
                        const keySubdivisions = grdSubdivisions.filter(subdivision => Object.keys(subdivision.data || {}).includes(grd.dataField));
                        let max = -Infinity; let min = Infinity;
                
                        // Find the max and min values for the data field
                        keySubdivisions.forEach(subdivision => {
                            const value = subdivision.data[grd.dataField];
                            if (!value) return;
                            if (Number(value) > max) max = Number(value);
                            if (Number(value) < min) min = Number(value);
                        });
                        const levels = Array.from({length: 4}, (_, i) => {
                            const value = ((max - min) * (i/3) + min);
                            const color = interpolateColor(((max - min) * (i/3) + min), min, max, grd.minColor, grd.maxColor)
                            return { value, color};
                        });
                        return [(<Typography sx={{
                            color: '#FFFFFF', 
                            fontFamily: 'JetBrains Mono', 
                            fontSize: '16px', 
                            marginRight: 'auto', 
                            marginLeft: '15px',
                            marginTop: '10px',
                        }}>{grd.dataField.charAt(0).toUpperCase() + grd.dataField.slice(1)}</Typography>),
                        levels.map((level, i) => (
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', overflow: '' }}>  
                                <Box sx={{ width: 22, minWidth: 22, height: 22, borderRadius: '5px', backgroundColor: level.color, marginRight: '10px', marginLeft: '15px'}} />
                                <Typography sx={{ marginLeft: '5px', marginRight: 'auto', color: '#FFFFFF', fontFamily: 'JetBrains Mono'}} noWrap='true'>{level.value.toFixed(2)}</Typography>
                            </Box>

                        ))]
                    }))]
                )
            )
            return div;
        }
        if (mapRef?.current) legend.addTo(mapRef.current); // Add legend to map
        legendRef.current = legend; // Store legend in ref
    }

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
            /* console.log(map); */
            await store.createMapComment(comment, map._id);
            const comments = await store.getMapComments(map);
            /* console.log(comments); */
            if (comments?.data.success) setMapComments(comments.data.comments);
            /* console.log(comments?.data.comments); */

            divRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setComment('');
    }

    async function handlePNG() {
        let element = document.getElementById("map")
        let width = element.offsetWidth
        let height = element.offsetHeight
        mapRef.current.removeControl(mapRef.current.zoomControl);
        mapRef.current.removeControl(mapRef.current.attributionControl);
        const dataURL = await domtoimage.toPng(element, { width, height })
        saveAs(dataURL, map.title + ".png")
        mapRef.current.addControl(mapRef.current.zoomControl);
        mapRef.current.addControl(mapRef.current.attributionControl);
    }

    async function handleJPG() {
        let element = document.getElementById("map")
        let width = element.offsetWidth
        let height = element.offsetHeight
        mapRef.current.removeControl(mapRef.current.zoomControl);
        mapRef.current.removeControl(mapRef.current.attributionControl);
        const dataURL = await domtoimage.toJpeg(element, { width, height })
        saveAs(dataURL, map.title + ".jpeg")
        mapRef.current.addControl(mapRef.current.zoomControl);
        mapRef.current.addControl(mapRef.current.attributionControl);
    }

    async function handleJSON() {
        saveAs(`${map?.mapFile}?${SASTOKENMAP}`, map.title + ".json")
        delete data._id
        delete data.__v
        console.log(data)
        var blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, map.title + "_schema.json")
    }

    async function handleForkMap() {
        if(!auth.user) {
            store.changeToLogin()
            return
        }
        let mapJSON = null
        await fetch(`${map?.mapFile}?${SASTOKENMAP}`, {mode: "cors"})
            .then((response) => response.json())
            .then((data) => {
                mapJSON = data;
            }).catch((error) => {
                mapJSON = null
            });
        let schema = null
        if(map?.mapSchema) {
            schema = await store.getSchema(map?.mapSchema);
            if(schema) {
                delete schema._id
                delete schema.__v
            }
        }
        let mapId = await store.forkMap(map, mapJSON, schema)
        if(mapId) {
            store.changeToEditMap(mapId)
        }
    }

    return (
        <Box display="flex" flexDirection="row">
            <Box 
                style={{backgroundColor: '#DDDDDD', borderRadius: '8px'}}
                sx={{ mx: 2, mt: 2, p:4 }}
                height='80vh'
                width='70vw'
            >
                <Box 
                    style={{backgroundColor: '#CCCCCC', borderRadius: '8px'}}
                    sx={{ p: 2, mb: 1.5 }}
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
                                src={`${user?.pfp}?${SASTOKENICON}`}
                                sx={{ bgcolor: "#E3256B", width: '32px', height: '32px', mr: 1 }}
                                onClick={user ? () => store.changeToProfile(user) : () => {}} 
                            >
                                {user?.username[0]}
                            </Avatar>
                            <Typography>
                                {user?.username} | Published {formatDate(map?.publishedDate)}
                            </Typography>
                        </Box>
                    </Box>
                    {handleLikeCounter()}
                    {handleDislikeCounter()}
                </Box>
                <Box display="flex" sx={{ pb: 1.5 }}>
                    <Button 
                        variant="contained"
                        sx={{ color: 'white', mr: 1 }} 
                        style={{fontSize:'16pt', maxWidth: '135px', maxHeight: '35px', minWidth: '135px', minHeight: '35px'}} 
                        disableRipple
                        color='razzmatazz'
                        onClick={handleJSON}
                    >
                        JSON
                    </Button>
                    <Button 
                        variant="contained"
                        sx={{ color: 'white', mx: 1 }} 
                        style={{fontSize:'16pt', maxWidth: '135px', maxHeight: '35px', minWidth: '135px', minHeight: '35px'}} 
                        disableRipple
                        color='razzmatazz'
                        onClick={handlePNG}
                    >
                        PNG
                    </Button>
                    <Button 
                        variant="contained"
                        sx={{ color: 'white', mx: 1 }} 
                        style={{fontSize:'16pt', maxWidth: '135px', maxHeight: '35px', minWidth: '135px', minHeight: '35px'}} 
                        disableRipple
                        color='razzmatazz'
                        onClick={handleJPG}
                    >
                        JPG
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ color: 'white', marginLeft: 'auto' }}
                        style={{ fontSize: '16pt', maxWidth: '135px', maxHeight: '35px', minWidth: '135px', minHeight: '35px' }}
                        disableRipple
                        color='razzmatazz'
                        alignItems='right'
                        onClick={handleForkMap}
                    >
                        Fork
                    </Button>
                </Box>
                <Box 
                    style={{backgroundColor: '#FFFFFF'}}
                    sx={{ p: 2 }}
                    display="flex"
                    height='50vh'
                    flexDirection="row"
                    alignItems="center"
                    ref={mapRef}
                    id="map"
                >
                </Box>
                <Box 
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    height="10vh"
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
                sx={{ mx: 2, mt: 2, p: 4 }}
                height='80vh'
                width='30vw'
            >
                <Box display="flex" flexDirection="row" alignItems="flex-end">
                    <Typography variant="h4" sx={{ ml: 4, mb: 2 }} color='#E3256B'>
                        Comments
                    </Typography>
                    <Typography variant="h6" sx={{ ml: 2, mb: 2 }} >
                        {map?.comments?.length}
                    </Typography>
                </Box>
                <Box className="map-comments" height="80%" style={styles.scroll} sx={{ mb: 2 }}>
                    <List sx={{ width: '90%', left: '5%' }}>
                        {mapComments?.map((cmt) => (
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