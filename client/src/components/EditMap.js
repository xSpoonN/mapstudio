import React, { useState, useEffect, useContext, useRef } from 'react';
import { GlobalStoreContext } from '../store';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Box, AppBar, Toolbar, Typography, Button, Drawer } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function EditMap() {
    const [openDrawer, setOpenDrawer] = useState(true);
    const mapRef = useRef(null); // Track map instance
    const geoJSONLayerRef = useRef(null); // Track GeoJSON layer instance
    const mapInitializedRef = useRef(false); // Track whether map has been initialized
    const { store } = useContext(GlobalStoreContext);
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
                <AppBar position="static" style={{ background: 'transparent', zIndex: 2000 }}>
                    {/* <div style={{margin: '-9px', marginTop: '-10px'}}>   */}
                    <Toolbar sx={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 2 }}>
                        <Box sx={{ marginRight: 'auto', backgroundColor: '#DDDDDD', borderRadius: '20px', minWidth: '460px', maxWidth: '460px' }}>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple>Import</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple>Export</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple>Publish</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple>Delete</Button>
                        </Box>
                        <Box sx={{ marginRight: '20%', backgroundColor: '#DDDDDD', borderRadius: '20px', minWidth: '870px', maxWidth: '870px' }}>
                            <Button variant="text" sx={styles.sxOverride} style={styles.bigButton} disableRipple onClick={() => setOpenDrawer(true)}>Map Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.bigButton} disableRipple onClick={() => setOpenDrawer(true)}>Subdivision Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.bigButton} disableRipple onClick={() => setOpenDrawer(true)}>Point Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.bigButton} disableRipple onClick={() => setOpenDrawer(true)}>Bin Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.bigButton} disableRipple onClick={() => setOpenDrawer(true)}>Gradient Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.bigButton} disableRipple onClick={() => setOpenDrawer(true)}>Templates</Button>
                        </Box>
                    </Toolbar>
                    {/* </div> */}
                </AppBar>
                <Box
                    style={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}
                    height='84vh'
                    alignItems="center"
                    ref={mapRef}
                >
                </Box>
            </Box>

            <Drawer
                anchor="right"
                variant="permanent"
                open={openDrawer}
                sx={{
                    width: '25%',
                    height: '70vh',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '25%',
                        boxSizing: 'border-box'
                    }
                }}
                onClose={() => setOpenDrawer(false)}
            >
                <Toolbar style={{marginTop: '25px'}}/>
                blah
            </Drawer>
        </Box>
    );
}