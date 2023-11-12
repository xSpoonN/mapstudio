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
            {/* <AppBar position="static">
                <Toolbar>
                    <Box sx={{ marginLeft: 'auto' }}>
                        <Button variant="contained">Import</Button>
                        <Button variant="contained">Export</Button>
                        <Button variant="contained">Publish</Button>
                    </Box>
                </Toolbar>
            </AppBar> */}

            <Box
                height='100vh'
                width='100vw'
            >
                <Box
                    style={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}
                    height='100vh'
                    alignItems="center"
                    ref={mapRef}
                >
                </Box>
            </Box>

            {/*             <Drawer
                anchor="right"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            > */}
            {/* Sidebar content */}
            {/* </Drawer> */}
        </Box>
    );
}