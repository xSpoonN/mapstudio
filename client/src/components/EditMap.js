import React, { useState, useEffect, useContext, useRef } from 'react';
import { GlobalStoreContext } from '../store';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'; // eslint-disable-line
import { IconButton, Box, AppBar, Toolbar, Button, Drawer } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import SaveIcon from '@mui/icons-material/Save';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapSidebar from './MapSidebar';
import PointSidebar from './PointSidebar';
import SubdivisionSidebar from './SubdivisionSidebar';
import BinSidebar from './BinSidebar';
import GradientSidebar from './GradientSidebar';
import TemplateSidebar from './TemplateSidebar';

export default function EditMap() {
    const [openDrawer, setOpenDrawer] = useState(true);
    const [sidebar, setSidebar] = useState('map');
    const mapRef = useRef(null); // Track map instance
    const geoJSONLayerRef = useRef(null); // Track GeoJSON layer instance
    const mapInitializedRef = useRef(false); // Track whether map has been initialized
    const { store } = useContext(GlobalStoreContext); // eslint-disable-line
    const styles = {
        standardButton: {
            fontSize: '14pt',
            maxWidth: '105px',
            maxHeight: '45px',
            minWidth: '105px',
            minHeight: '45px'
        },
        bigButton: {
            fontSize: '14pt',
            maxWidth: '200px',
            maxHeight: '45px',
            minWidth: '105px',
            minHeight: '45px'
        },
        toolbarButton: {
            position: 'absolute',
            fontSize: '14pt',
            left: '-5px',
            maxWidth: '45px',
            maxHeight: '45px',
            minWidth: '45px',
            minHeight: '45px',
            zIndex: 9999
        },
        toolbarBG: {
            position: 'absolute', 
            top: '225px', 
            left: '5.5px',
            marginRight: 'auto', 
            backgroundColor: '#DDDDDD',
            border: '1px solid #333333',
            borderRadius: '20px', 
            minWidth: '40px', 
            minHeight: '130px',
            zIndex: 9998
        },
        sxOverride: {
            color: '#333333',
            mx: 0.5,
            '&:hover': {
                color: '#E3256B'
            }
        }
    }

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
    });
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box height='80vh' width='100vw' style={{ flex: 1 }} >
                {/* Toolbar */}
                <AppBar position="static" style={{ background: 'transparent', zIndex: 2000 }}>
                    <Toolbar sx={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 2 }}>
                        <Box sx={{ marginRight: 'auto', backgroundColor: '#DDDDDD', borderRadius: '20px', minWidth: '460px', maxWidth: '460px' }}>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple>Import</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple>Export</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple>Publish</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple>Delete</Button>
                        </Box>
                        <Box sx={{ marginRight: '20%', backgroundColor: '#DDDDDD', borderRadius: '20px', minWidth: '870px', maxWidth: '870px' }}>
                            <Button variant="text" sx={styles.sxOverride} style={styles.bigButton} disableRipple onClick={() => setSidebar('map')}>Map Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.bigButton} disableRipple onClick={() => setSidebar('subdivision')}>Subdivision Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.bigButton} disableRipple onClick={() => setSidebar('point')}>Point Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.bigButton} disableRipple onClick={() => setSidebar('bin')}>Bin Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.bigButton} disableRipple onClick={() => setSidebar('gradient')}>Gradient Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.bigButton} disableRipple onClick={() => setSidebar('template')}>Templates</Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                    
                {/* Map */}
                <Box
                    style={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}
                    height='84vh'
                    alignItems="center"
                    overflow="hidden"
                    ref={mapRef}
                >
                </Box>

                
                <Box sx={styles.toolbarBG}>
                    <IconButton sx={styles.sxOverride} style={{...styles.toolbarButton}}><ReplayIcon/></IconButton>
                    <IconButton sx={styles.sxOverride} style={{...styles.toolbarButton, top:'40px'}}><ReplayIcon sx={{ transform: 'scaleX(-1)' }} /></IconButton>
                    <IconButton sx={styles.sxOverride} style={{...styles.toolbarButton, top:'80px'}}><SaveIcon/></IconButton>
                </Box>
            </Box>

            {/* Sidebar */}
            <Drawer
                anchor="right"
                variant="persistent"
                open={openDrawer}
                sx={{
                    width: '25%',
                    height: '80%',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '25%',
                        boxSizing: 'border-box'
                    }
                }}
                onClose={() => setOpenDrawer(false)}
            >
                <Toolbar style={{marginTop: '25px'}}/>
                {sidebar === 'map' && <MapSidebar />}
                {sidebar === 'subdivision' && <SubdivisionSidebar />}
                {sidebar === 'point' && <PointSidebar />}
                {sidebar === 'bin' && <BinSidebar />}
                {sidebar === 'gradient' && <GradientSidebar />}
                {sidebar === 'template' && <TemplateSidebar />}
            </Drawer>
        </Box>
    );
}