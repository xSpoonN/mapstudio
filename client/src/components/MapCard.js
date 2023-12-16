import { useContext, useRef, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EditIcon from '@mui/icons-material/Edit';

const SASTOKENMAP = 'sp=r&st=2023-12-03T19:46:53Z&se=2025-01-09T03:46:53Z&sv=2022-11-02&sr=c&sig=LL0JUIq%2F3ZfOrYW8y4F4lk67ZXHFlGdmY%2BktKsHPkss%3D';

export default function MapCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const mapRef = useRef(null); // Track map instance
    const geoJSONLayerRef = useRef(null); // Track GeoJSON layer instance
    const mapInitializedRef = useRef(false); // Track whether map has been initialized
    const [map, setMap] = useState(null);

    useEffect(() => {
        const fetchMap = async () => {
            const resp = await store.getMap(props.mapID);
            if(resp) {
                setMap(resp);
            }
        }
        fetchMap()
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!mapInitializedRef.current) { // Initialize map if it hasn't been initialized yet
            mapRef.current = L.map(mapRef.current).setView([0, 0], 2); // Initialize Leaflet map with default view/zoom
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current); // Add OpenStreetMap tiles
            mapInitializedRef.current = true; // Mark map as initialized
        }

        if(map?.mapFile !== undefined && map?.mapFile !== "" && map?.mapFile !== null   ) { 
            fetch(`${map?.mapFile}?${SASTOKENMAP}`, {mode: "cors"})
                .then((response) => response.json())
                .then((geojson) => {
                    if (geoJSONLayerRef.current) geoJSONLayerRef.current.clearLayers(); // Remove existing GeoJSON layer
                    else geoJSONLayerRef.current = L.geoJSON(geojson).addTo(mapRef.current); // Add new GeoJSON layer
                    geoJSONLayerRef.current.addData(geojson); // Add GeoJSON data to layer
                }).catch((error) => {
                    console.error('Error reading GeoJSON', error);
                });
        }

        mapRef.current.setView([0, 0], 0);
        mapRef.current.removeControl(mapRef.current.zoomControl);
        mapRef.current.removeControl(mapRef.current.attributionControl);
        mapRef.current.scrollWheelZoom.disable();
        mapRef.current.doubleClickZoom.disable();
        mapRef.current.dragging.disable();
        mapRef.current.keyboard.disable();

        return () => { if (geoJSONLayerRef.current) geoJSONLayerRef.current.clearLayers(); }; // Remove GeoJSON layer on unmount
    }, [map]); // eslint-disable-line react-hooks/exhaustive-deps

    const styles = {
        card: {
            maxWidth: 400,
            borderRadius: 16, // Adjust the value to control the roundness of corners
        },
        media: {
            height: 0,
            paddingTop: '60%', // 1:1 aspect ratio for the photo
            borderRadius: '16px 16px 0 0', // Rounded top corners
        },
        content: {
            padding: '16px',
        },
        counters: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        item: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        edited: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
    };

    function formatDate(dateString) {
        const currentDate = new Date();
        const inputDate = new Date(dateString);

        // Check if the input date is today
        if (
            inputDate.getDate() === currentDate.getDate() &&
            inputDate.getMonth() === currentDate.getMonth() &&
            inputDate.getFullYear() === currentDate.getFullYear()
        ) {
            return `Today ${inputDate.getHours()}:${String(inputDate.getMinutes()).padStart(2, '0')}`;
        }

        // Check if the input date is yesterday
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);
        if (
            inputDate.getDate() === yesterday.getDate() &&
            inputDate.getMonth() === yesterday.getMonth() &&
            inputDate.getFullYear() === yesterday.getFullYear()
        ) {
            return `Yesterday ${inputDate.getHours()}:${String(inputDate.getMinutes()).padStart(2, '0')}`;
        }

        // If none of the above conditions match, return YYYY-MM-DD format
        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        const day = String(inputDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} ${inputDate.getHours()}:${String(inputDate.getMinutes()).padStart(2, '0')}`;
    }

    let y = 
        <Typography variant="caption" color="grey" mx={1}>
            By: {props.author}
        </Typography>
    if(store.currentScreen !== "search" && store.currentScreen !== "landing") {
        y = <></>
    }

    let x = 
        <>
        {y}
        <div style={styles.counters}>
            <Box style={styles.item}>
                <Typography variant="caption" color="grey" mx={1}>
                    {props.comments}
                </Typography>
                <CommentIcon style={{ color:'grey' }} mx={1}/>
            </Box>
            <Box style={styles.item}>
                <Typography variant="caption" color="grey" mx={1}>
                    {props.likes}
                </Typography>
                <ThumbUpIcon style={{ color:'grey' }} mx={1}/>
            </Box>
            <Box style={styles.item}>
                <Typography variant="caption" color="grey" mx={1}>
                    {props.dislikes}
                </Typography>
                <ThumbDownIcon style={{ color:'grey' }} mx={1}/>
            </Box>
        </div>
        </>
        
    if(props.shared === "Private") {
        x = 
            <div style={styles.edited}>
                <Box style={styles.item}>
                    <EditIcon style={{ color:'grey' }} mx={1}/>
                    <Typography variant="caption" color="grey" mx={1}>
                        {formatDate(props.lastEdited)}
                    </Typography>
                </Box>
            </div>
    }

    function handleCardClick() {
        if(props.shared === "Private") {
            store.changeToEditMap(props.mapID);
        } else {
            console.log('handleCardClick: ' + props.mapID)
            store.changeToMapView(props.mapID);
        }
    }

    return (
        <Card className="map-card" style={styles.card} onClick={handleCardClick}>
            <CardMedia
                style={styles.media}
                ref={mapRef}
                title="Card Image"
            />
            <CardContent style={styles.content}>
                <Typography variant="h6" component="div">
                    {props.name}
                </Typography>
                <Typography variant="h6" component="div" color={props.shared === 'Public' ? '#66bb6a' : (props.shared === 'Private' ? '#ef5350' : undefined)}>
                    {props.shared}
                </Typography>   
                {/* props.hideTime ||  */x}
            </CardContent>
        </Card>
    );
}