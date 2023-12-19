import React, { useState, useEffect, useContext, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalStoreContext } from '../store';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'; // eslint-disable-line
import { IconButton, Box, AppBar, Toolbar, Button, Drawer, Typography, Snackbar, Alert } from '@mui/material';
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
import HeatMapSidebar from './HeatSidebar';
import ConfirmModal from './ConfirmModal';
import togeojson from 'togeojson';
import * as shapefile from 'shapefile';
import { saveAs } from 'file-saver';
const Ajv = require('ajv');
const ajv = new Ajv();

const SASTOKEN = 'sp=r&st=2023-12-03T19:46:53Z&se=2025-01-09T03:46:53Z&sv=2022-11-02&sr=c&sig=LL0JUIq%2F3ZfOrYW8y4F4lk67ZXHFlGdmY%2BktKsHPkss%3D';
const SCHEMA = {  // The Schema format to validate against
    "$schema": "http://json-schema.org/draft-07/schema#",
    "definitions": {
      "bin": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "color": { "type": "string", "default": "#000000" },
          "subdivisions": {
            "type": "array",
            "items": { "type": "string" },
            "uniqueItems": true
          }
        },
        "required": [ "name" ]
      },
      "subdivision": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "weight": {
            "type": "number",
            "maximum": 1,
            "minimum": 0,
            "default": 1
          },
          "color": { "type": "string", "default": "#000000" }
        },
        "required": [ "name" ],
        "additionalProperties": {
          "type": "object",
          "properties": {
            "data": {
              "type": "object",
              "additionalProperties": { "type": "number"  }
            }
          }
        }
      },
      "point": {
        "type": "object",
        "properties": {
          "name" : { 
            "type": "string" 
          },
          "location": {
            "type": "object",
            "properties": {
              "lat": { "type": "number", "minimum": -90, "maximum": 90 },
              "lon": { "type": "number", "minimum": -180, "maximum": 180 }
            },
            "required": [ "lat", "lon" ]
          },
          "weight": {
            "type": "number",
            "maximum": 1,
            "minimum": 0,
            "default": 1
          }
        },
        "required": [ "location" ]
      },
      "heatmap": {
        "type": "object",
        "properties": {
            "radius": { "type": "number", "minimum": 10, "maximum":50, "default":25}, // radius of points 
            "blur": { "type": "number", "minimum": 10, "maximum":50, "default":15},   // blur of points
            "points": {                                  // points of the heatmap
                "type": "array",
                "items": { "$ref": "#/definitions/point" }, // use points definition above
                "uniqueItems": true
            }
        },
        "required": [ "radius", "blur", "points" ]
    },
      "gradient": {
        "type": "object",
        "properties": {
          "dataField": { "type": "string" },
          "minColor": { "type": "string", "default": "#000000" },
          "maxColor": { "type": "string", "default": "#E3256B" },
          "subdivisions": {
            "type": "array",
            "items": { "type": "string" },
            "uniqueItems": true
          }
        },
        "required": [ "dataField" ]
      }
    },
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": [ "bin", "gradient", "heatmap", "point", "satellite", "none" ]
      },
      "bins": {
        "type": "array",
        "items": { "$ref": "#/definitions/bin" },
        "uniqueItems": true
      },
      "subdivisions": {
        "type": "array",
        "items": { "$ref": "#/definitions/subdivision" },
        "uniqueItems": true
      },
      "points": {
        "type": "array",
        "items": { "$ref": "#/definitions/point" },
        "uniqueItems": true
      },
      "gradients": {
        "type": "array",
        "items": { "$ref": "#/definitions/gradient" },
        "uniqueItems": true
      },
      "heatmaps": {
        "type": "array",
        "items": { "$ref": "#/definitions/heatmap" },
        "uniqueItems": true
    },
      "showSatellite": {
        "type": "boolean",
        "default": false
      }
    },
    "required": [ "type" ]
}
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
    bigButtonSelected: {
        fontSize: '14pt',
        maxWidth: '200px',
        maxHeight: '45px',
        minWidth: '105px',
        minHeight: '45px',
        color: '#EEEEEE',
        backgroundColor: '#E3256B',
        borderRadius: '10px'
    },
    toolbarButton: {
        position: 'absolute',
        fontSize: '14pt',
        left: '-5px',
        maxWidth: '45px',
        maxHeight: '45px',
        minWidth: '45px',
        minHeight: '45px',
        zIndex: 1000
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
        zIndex: 999
    },
    sxOverride: {
        color: '#333333',
        mx: 0.5,
        '&:hover': {
            color: '#E3256B'
        }
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

export default function EditMap({ mapid }) {
    const [openDrawer, setOpenDrawer] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [snackbarAutoHide, setSnackbarAutoHide] = useState(3000);
    const [sidebar, setSidebar] = useState('map');
    const [map, setMap] = useState(null); // Map metadata from database
    const [feature, setFeature] = useState(null); // Current feature selected on map (for subdivisions)
    const [currentPoint, setCurrentPoint] = useState(null); // Current point selected on map
    const [data, setData] = useState(null); // JSON schema containing all map data
    const [markers, setMarkers] = useState([]); // eslint-disable-line
    const [mapEditMode, setMapEditMode] = useState('None'); // Current map edit mode ['None', 'AddPoint', ]
    const mapRef = useRef(null); // Track map instance
    const geoJSONLayerRef = useRef(null); // Track GeoJSON layer instance
    const markerLayerRef = useRef(null); // Track marker featuregroup instance
    const mapInitializedRef = useRef(false); // Track whether map has been initialized
    const satelliteLayerRef = useRef(null); // Track satellite layer instance
    const legendRef = useRef(null); // Track legend instance
    const [showSatellite, setShowSatellite] = useState(false);
    const { store } = useContext(GlobalStoreContext); // eslint-disable-line
    const heatLayerRef = useRef(null);
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
    });
    

    function RenderNewGeoJSON(geojsonData) {
        if (geoJSONLayerRef.current) { geoJSONLayerRef.current.clearLayers(); }
        geoJSONLayerRef.current = L.geoJSON(geojsonData, { 
            onEachFeature: (feature, layer) => onEachFeature(feature, layer, mapEditMode)
         }).addTo(mapRef.current);
        updateMapFileData(mapid, geojsonData);
    };

    // Installs click handler for each subdivision feature
    function onEachFeature(feature, layer, editMode) {
        layer.on('click', function(e) { 
            L.DomEvent.stopPropagation(e)
            if (editMode !== 'None') return;
            console.log(feature.properties);
            setFeature(feature.properties);
            store.setMapData(map); // Forces a rerender by updating store
            setSidebar('subdivision');
        });
        mapRef.current?.on('click', function(e) {
            setFeature(null)
        })
    }

    // Handles all map editing that deals with interaction with the map, and not the sidebar
    useEffect(() => {
        console.log("map edit mode changed to " + mapEditMode);
        if (!mapRef.current || !geoJSONLayerRef.current) return; // Map not initialized yet
        if (mapEditMode === 'DeletePoint') { // Delete point
            setSidebar('map'); // Reset sidebar to hide the deleted point
            const newPoints = data?.points.filter(point => point.name !== currentPoint.name);
            console.log(newPoints);
            loadPoints(newPoints); // Rerender points
            return setMapEditMode('None'); // Reset edit mode
        } else if (mapEditMode === 'MovePoint') {
            setOpenSnackbar(true);
            setSnackbarMessage('Click to move the point');
            setSnackbarSeverity('info');
            setSnackbarAutoHide(null);
            mapRef.current?.off('click'); // Remove existing click handler
            mapRef.current?.on('click', async function(e) {
                if (mapEditMode !== 'MovePoint') return console.log(mapEditMode); // Check if edit mode has changed since click handler was installed
                console.log(e.latlng.lat, e.latlng.lng);
                const lat = e.latlng.lat; // Get new point location
                const lng = e.latlng.lng;
                const existing = data?.points?.find(point => point.name === currentPoint.name); // Find existing point to edit
                if (existing) { // Technically this should always be true
                    const newPoint = { // Create new point object with updated location
                        ...existing,
                        location: {lat: lat, lon: lng}, 
                    };
                    console.log(newPoint);

                    // Update point in data
                    const newPoints = data.points.map(point => { return point.name === currentPoint.name ? newPoint : point; });
                    const updatedSchema = {...data, points: newPoints};
                    await store.updateMapSchema(mapid, updatedSchema);

                    // Rerender points
                    loadPoints(newPoints);
                    setCurrentPoint(newPoint);
                    return setMapEditMode('None'); // Reset edit mode
                }
            });
            geoJSONLayerRef.current?.eachLayer((layer) => {
                layer.off('click'); // Remove existing click handler
                layer.on('click', function() { 
                    console.log(mapEditMode);
                    if (mapEditMode !== 'None') return; // Edit mode should still be 'MovePoint' but check just in case it changed
                    console.log(layer.feature.properties);
                    setFeature(layer.feature.properties);
                    store.setMapData(map); // Forces a rerender by updating store
                    setSidebar('subdivision');
                });
            });
        } else if (mapEditMode === 'AddPoint') {
            setOpenSnackbar(true);
            setSnackbarMessage('Click to add a point');
            setSnackbarSeverity('info');
            setSnackbarAutoHide(null);
            mapRef.current?.off('click'); // Remove existing click handler
            mapRef.current?.on('click', function(e) {
                if (mapEditMode !== 'AddPoint') return console.log(mapEditMode); // Check if edit mode has changed since click handler was installed
                console.log(e.latlng.lat, e.latlng.lng);
                const lat = e.latlng.lat; // Get new point location
                const lng = e.latlng.lng;
                const newPoint = { // Create new point object
                    name: lat.toFixed(4) + ', ' + lng.toFixed(4),
                    location: {lat: lat, lon: lng}, 
                    weight: 0.5};
                const newPoints = [...data?.points, newPoint];

                // Rerender points
                loadPoints(newPoints);
                setMapEditMode('None'); // Reset edit mode

                // Update point in data
                store.updateMapSchema(mapid, {...data, points: newPoints});
            });
            geoJSONLayerRef.current?.eachLayer((layer) => {
                layer.off('click'); // Remove existing click handler
                layer.on('click', function() { 
                    console.log(mapEditMode);
                    if (mapEditMode !== 'None') return; // Edit mode should still be 'AddPoint' but check just in case it changed
                    console.log(layer.feature.properties);
                    setFeature(layer.feature.properties);
                    store.setMapData(map); // Forces a rerender by updating store
                    setSidebar('subdivision');
                });
            });
        } else if (mapEditMode.startsWith('AddToBin')) { // AddToBin-<bin name>
            setOpenSnackbar(true);
            setSnackbarMessage('Click to add a subdivision to the bin');
            setSnackbarSeverity('info');
            setSnackbarAutoHide(null);
            const binName = mapEditMode.split('-').slice(1).join('-'); // Get bin name from edit mode
            const binData = data?.bins?.find(bin => bin.name === binName); // Get bin data from schema
            mapRef.current?.off('click'); // Remove existing click handler
            mapRef.current?.on('click', () => {}); // Add empty click handler to prevent clicking on map from doing anything
            geoJSONLayerRef.current?.eachLayer((layer) => {
                layer.off('click'); // Remove existing click handler
                layer.on('click', async function() { 
                    console.log(mapEditMode);
                    if (!mapEditMode.startsWith('AddToBin')) return; // Check if edit mode has changed since click handler was installed
                    console.log(layer.feature.properties);

                    // Find clicked subdivision in schema
                    let existing = data?.subdivisions?.find(subdivision => 
                        subdivision.name === layer.feature.properties.name || subdivision.name === layer.feature.properties.NAME || subdivision.name === layer.feature.properties.Name
                    );
                    let newSubdivisions
                    if (existing) { // Subdivision already exists in schema
                        newSubdivisions = data.subdivisions.map(subdivision => {
                            return subdivision.name === existing.name ? {...subdivision, color: binData.color, weight: 0.5} : subdivision;
                        });
                    } else { // Subdivision does not exist in schema, create a new object for it
                        const newSubdivision = {
                            name: layer.feature.properties.name || layer.feature.properties.NAME || layer.feature.properties.Name,
                            color: binData.color,
                            weight: 0.5 // Weight is reset to default
                        }
                        newSubdivisions = [...data.subdivisions, newSubdivision];
                        existing = newSubdivision;
                    }
                    const newBins = data.bins.map(bin => { // Update bin in schema
                        return bin.name === binName ? {...bin, subdivisions: [...(bin.subdivisions || []), existing.name]} : bin;
                    });

                    // Update schema
                    const updatedSchema = {...data, subdivisions: newSubdivisions, bins: newBins};
                    await store.updateMapSchema(mapid, updatedSchema);
                    setData(updatedSchema);

                    // Rerender subdivisions
                    drawSubdivisions(updatedSchema);
                    return setMapEditMode('None'); // Reset edit mode
                });
            });
        } else if (mapEditMode.startsWith('DeleteFromBin')) { // DeleteFromBin-<bin name>
            setOpenSnackbar(true);
            setSnackbarMessage('Click to remove a subdivision from the bin');
            setSnackbarSeverity('info');
            setSnackbarAutoHide(null);
            const binName = mapEditMode.split('-').slice(1).join('-'); // Get bin name from edit mode
            mapRef.current?.off('click'); // Remove existing click handler
            mapRef.current?.on('click', () => {}); // Add empty click handler to prevent clicking on map from doing anything
            geoJSONLayerRef.current?.eachLayer((layer) => {
                layer.off('click'); // Remove existing click handler
                layer.on('click', async function() { 
                    console.log(mapEditMode);
                    if (!mapEditMode.startsWith('DeleteFromBin')) return; // Check if edit mode has changed since click handler was installed
                    console.log(layer.feature.properties);

                    // Find clicked subdivision in schema
                    const existing = data?.subdivisions?.find(subdivision => 
                        subdivision.name === layer.feature.properties.name || subdivision.name === layer.feature.properties.NAME || subdivision.name === layer.feature.properties.Name
                    );
                    if (existing) {
                        const newSubdivisions = data.subdivisions.map(subdivision => { // Update subdivision in schema
                            return subdivision.name === existing.name ? {...subdivision, color: '#DDDDDD', weight: 0.5} : subdivision;
                        });
                        const newBins = data.bins.map(bin => { // Update bin in schema
                            return bin.name === binName ? {...bin, subdivisions: bin.subdivisions.filter(subdivision => subdivision !== existing.name)} : bin;
                        });

                        // Update schema
                        const updatedSchema = {...data, subdivisions: newSubdivisions, bins: newBins};
                        await store.updateMapSchema(mapid, updatedSchema);
                        setData(updatedSchema);
                        
                        // Rerender subdivisions
                        drawSubdivisions(updatedSchema);
                    }
                    return setMapEditMode('None'); // Reset edit mode
                });
            });
        } else if (mapEditMode.startsWith('AddToGradient')) { // AddToGradient-<gradient datafield>
            setOpenSnackbar(true);
            setSnackbarMessage('Click to add a subdivision to the gradient');
            setSnackbarSeverity('info');
            setSnackbarAutoHide(null);
            const grdName = mapEditMode.split('-').slice(1).join('-'); // Get gradient name from edit mode
            const grdData = data?.gradients?.find(grd => grd.dataField === grdName); // Get bin data from schema
            mapRef.current?.off('click'); // Remove existing click handler
            mapRef.current?.on('click', () => {}); // Add empty click handler to prevent clicking on map from doing anything
            geoJSONLayerRef.current?.eachLayer((layer) => {
                layer.off('click'); // Remove existing click handler
                layer.on('click', async function() { 
                    console.log(mapEditMode);
                    if (!mapEditMode.startsWith('AddToGradient')) return; // Check if edit mode has changed since click handler was installed
                    console.log(layer.feature.properties);

                    // Find clicked subdivision in schema
                    let existing = data?.subdivisions?.find(subdivision => 
                        subdivision.name === layer.feature.properties.name || subdivision.name === layer.feature.properties.NAME || subdivision.name === layer.feature.properties.Name
                    );
                    let newSubdivisions
                    if (existing) { // Subdivision already exists in schema
                        newSubdivisions = data.subdivisions.map(subdivision => {
                            return subdivision.name === existing.name ? {
                                ...subdivision, 
                                color: grdData.minColor, 
                                weight: 0.5,
                                data: Object.keys(subdivision.data || {})?.includes(grdData.dataField) ? subdivision.data : {
                                    ...(subdivision.data || {}),
                                    [grdData.dataField]: 0
                                }
                            } : subdivision;
                        });
                    } else { // Subdivision does not exist in schema, create a new object for it
                        const newSubdivision = {
                            name: layer.feature.properties.name || layer.feature.properties.NAME || layer.feature.properties.Name,
                            color: grdData.minColor,
                            weight: 0.5, // Weight is reset to default
                            data: {
                                [grdData.dataField]: 0
                            }
                        }
                        newSubdivisions = [...data.subdivisions, newSubdivision];
                        existing = newSubdivision;
                    }
                    const newGrds = data.gradients.map(grd => { // Update grd in schema
                        return grd.dataField === grdName ? {...grd, subdivisions: [...(grd.subdivisions || []), existing.name]} : grd;
                    });

                    // Update schema
                    const updatedSchema = {...data, subdivisions: newSubdivisions, gradients: newGrds};
                    await store.updateMapSchema(mapid, updatedSchema);
                    setData(updatedSchema);

                    // Rerender subdivisions
                    drawSubdivisions(updatedSchema);
                    return setMapEditMode('None'); // Reset edit mode
                });
            });
        } else if (mapEditMode.startsWith('DeleteFromGradient')) { // DeleteFromGradient-<gradient datafield>
            setOpenSnackbar(true);
            setSnackbarMessage('Click to remove a subdivision from the gradient');
            setSnackbarSeverity('info');
            setSnackbarAutoHide(null);
            const grdName = mapEditMode.split('-').slice(1).join('-'); // Get gradient name from edit mode
            mapRef.current?.off('click'); // Remove existing click handler
            mapRef.current?.on('click', () => {}); // Add empty click handler to prevent clicking on map from doing anything
            geoJSONLayerRef.current?.eachLayer((layer) => {
                layer.off('click'); // Remove existing click handler
                layer.on('click', async function() { 
                    console.log(mapEditMode);
                    if (!mapEditMode.startsWith('DeleteFromGradient')) return; // Check if edit mode has changed since click handler was installed
                    console.log(layer.feature.properties);

                    // Find clicked subdivision in schema
                    const existing = data?.subdivisions?.find(subdivision => 
                        subdivision.name === layer.feature.properties.name || subdivision.name === layer.feature.properties.NAME || subdivision.name === layer.feature.properties.Name
                    );
                    if (existing) {
                        // Check if the subdivision is affected by a bin too
                        const otherBin = data.bins.find(bin => bin.subdivisions?.includes(existing.name));

                        const newSubdivisions = data.subdivisions.map(subdivision => { // Update subdivision in schema
                            return subdivision.name === existing.name ? {...subdivision, color: otherBin?.color || '#DDDDDD', weight: 0.5} : subdivision;
                        });
                        const newGrds = data.gradients.map(grd => { // Update grd in schema
                            return grd.dataField === grdName ? {...grd, subdivisions: grd.subdivisions.filter(subdivision => subdivision !== existing.name)} : grd;
                        });

                        // Update schema
                        const updatedSchema = {...data, subdivisions: newSubdivisions, gradients: newGrds};
                        await store.updateMapSchema(mapid, updatedSchema);
                        setData(updatedSchema);
                        
                        // Rerender subdivisions
                        drawSubdivisions(updatedSchema);
                    }
                    return setMapEditMode('None'); // Reset edit mode
                });
            });
        } else { // None
            setOpenSnackbar(false);
            setSnackbarSeverity('info');
            setSnackbarAutoHide(null);
            mapRef.current?.off('click'); // Remove existing click handler
            mapRef.current?.on('click', () => setFeature(null)); // Add empty click handler to prevent clicking on map from doing anything
            geoJSONLayerRef.current?.eachLayer((layer) => {
                layer.off('click'); // Remove existing click handler
                layer.on('click', function(e) { 
                    L.DomEvent.stopPropagation(e)
                    console.log(mapEditMode);
                    if (mapEditMode !== 'None') return;
                    console.log(layer.feature.properties);
                    setFeature(layer.feature.properties);
                    store.setMapData(map); // Forces a rerender by updating store
                    setSidebar('subdivision');
                });
            });
        }
    }, [mapEditMode]) // eslint-disable-line react-hooks/exhaustive-deps

    // Handles adding a new point to the map
    function addPointCallback (e) {
            /* console.log("click"); */
            if (mapEditMode === 'None') return setCurrentPoint(null) // If not in edit mode, do nothing
            if (mapEditMode !== 'AddPoint') return console.log(mapEditMode); // Check if edit mode has changed since click handler was installed
            console.log(e.latlng.lat, e.latlng.lng);
            const lat = e.latlng.lat; // Get new point location
            const lng = e.latlng.lng;
            const newPoint = {
                name: lat.toFixed(4) + ', ' + lng.toFixed(4),
                location: {lat: lat, lon: lng}, 
                weight: 0.5
            };

            // Update point in data
            const newPoints = [...data?.points, newPoint];
            loadPoints(newPoints); // Rerender points
            setMapEditMode('None'); // Reset edit mode
            store.updateMapSchema(mapid, {...data, points: newPoints});
    }

    async function updateMapFileData(mapid, geojsonData) {
        try {
            const resp = await store.updateMapFile(mapid, geojsonData);
            console.log(resp);
        } catch (err) {
            console.log('Error updating map file data in database');
        }
    }

/*-----------------------------heatmap-----------------------------------*/

    // Parse csv data into heatmap points array data
    function parseCSVForHeatMap(csvText) {
        console.log("entering parsing csv to heatmap data");
        const lines = csvText.split('\n');
        let latIndex = -1, lngIndex = -1;
        let headers = lines[0].split(',');
        let isHeaderDetected = false;
        const latPossibleNames = ['latitude', 'lat'];
        const lngPossibleNames = ['longitude', 'long', 'lng'];
        // detect header row
        if (headers.length > 1) {
            headers = headers.map(header => header.toLowerCase().trim());
            latIndex = headers.findIndex(header => latPossibleNames.some(name => header.includes(name)));
            lngIndex = headers.findIndex(header => lngPossibleNames.some(name => header.includes(name)));
            isHeaderDetected = latIndex !== -1 && lngIndex !== -1;
        }
        // if header row is not detected, try to detect latitude and longitude columns
        if (!isHeaderDetected) {
            const maxLat = 90, minLat = -90, maxLng = 180, minLng = -180;
            for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].split(',');
                for (let j = 0; j < parts.length; j++) {
                    const val = parseFloat(parts[j]);
                    if (!isNaN(val)) {
                        if (minLat <= val && val <= maxLat) {
                            latIndex = j;
                        } else if (minLng <= val && val <= maxLng) {
                            lngIndex = j;
                        }
                    }
                }
                if (latIndex !== -1 && lngIndex !== -1) break;
            }
        }
        if (latIndex === -1 || lngIndex === -1) {
            console.error('Latitude or longitude columns could not be detected.');
            return [];
        }
        // parse csv data
        const startIndex = isHeaderDetected ? 1 : 0;
        return lines.slice(startIndex).reduce((acc, line) => {
            const parts = line.split(',');
            const lat = parseFloat(parts[latIndex]);
            const lng = parseFloat(parts[lngIndex]);
            if (!isNaN(lat) && !isNaN(lng)) {
                acc.push([lat, lng, 1]); // default weight is 1
            }
            return acc;
        }, []);
    }

    // Create new heatmap object by points array data
    function createHeatMapObject(pointsArrayData, radius, blur) {
        // if radius, blur == null, use default values
        if (radius === undefined) { radius = 25;}
        if (blur === undefined) {blur = 15;}

        // if radius, blur != null , use given values
        const heatMapObject = {
            "radius": radius, "blur": blur,
            "points": pointsArrayData.map(([lat, lng, weight], index) => ({
                "name": "point" + index,
                "location": {"lat": lat,"lon": lng},
                "weight": weight
            }))
        };
        console.log("create new heatmap object:");
        console.log(heatMapObject);
        return heatMapObject;
    }

    // render parsed csv points data to heatmap
    function renderPArrayToHeatMap(pointsArrayData, radius, blur) {
        // if the radius and blur are not specified, use default values
        if (radius === undefined || blur === undefined) {
            const heatLayer = L.heatLayer(pointsArrayData, { radius: 25, blur: 15 }).addTo(mapRef.current);
            console.log("Render points Array with unspecified radius or blur: heat layer:");
            console.log(heatLayer);
            if(heatLayer) {
                heatLayerRef.current = heatLayer;
            }
        }
        // if the radius and blur are specified, use the specified values
        else {
            if (heatLayerRef.current) {
                mapRef?.current?.removeLayer(heatLayerRef.current);
            }
            const heatLayer = L.heatLayer(pointsArrayData, { radius: radius, blur: blur }).addTo(mapRef.current);
            console.log("Render points Array with given radius and blur: heat layer:");
            console.log(heatLayer);
            console.log(radius + "," + blur)
            if(heatLayer) {
                heatLayerRef.current = heatLayer;
            }
        }
    }
   // render current map schema's heatmap block to heatmap
    function renderHeatSchemaToHeatMap(mapSchema) {
        console.log("Entering: renderHeatSchemaToHeatMap");
        if (mapSchema?.type === 'heatmap' && mapSchema?.heatmaps?.length > 0) {
            console.log("process map schema, extract heatmap's data:");
            const heatMap = mapSchema.heatmaps[0];
            console.log(heatMap);
            const radius = heatMap.radius;
            const blur = heatMap.blur;
            const pointsArrayData = heatMap.points.map(point => [point.location.lat, point.location.lon, point.weight * 20]);
            console.log(" Transfer heatmap's data to 'renderPArrayToHeatMap': ");
            renderPArrayToHeatMap(pointsArrayData, radius, blur);
        } else if (mapSchema?.heatmaps?.length === 0 && heatLayerRef.current) {
            mapRef.current.removeLayer(heatLayerRef.current);
        }
        return null;
    }

    const handleHeatMapChange = async(radius, blur, committed) => {
        console.log("Handle R   B changing:  ");
        console.log("Input R   B:" + radius + "|||||||| " + blur);

        if (!data || !data.heatmaps || data.heatmaps.length === 0) {
            console.log("Handle: no heatmap in current map schema");
            await store.updateMapSchema(mapid, {...data, heatmaps: []});
            return
        }

        let changedMapSchema = JSON.parse(JSON.stringify(data))

        changedMapSchema.heatmaps[0].radius = radius;
        changedMapSchema.heatmaps[0].blur = blur;

        if (committed) {
            console.log("After setData(changedMapSchema):");
            console.log(changedMapSchema);
            await store.updateMapSchema(mapid, changedMapSchema);
        }

        if (heatLayerRef.current) {
            heatLayerRef.current.setOptions({radius:radius, blur:blur});
            // heatLayerRef.current.redraw();
        }
    };

    async function clearHeatMap() {
        console.log("clear")
        if(heatLayerRef.current) {
            mapRef.current.removeLayer(heatLayerRef.current);
            let newData = {...data, heatmaps: []}
            setData(newData)
            await store.updateMapSchema(mapid, newData);
        }
    }

    async function heatExistingPoints() {
        console.log("useExistingPoints")
        const heatMapObject = {
            "radius": 25, "blur": 15,
            "points": data.points.map((point, index) => ({
                "name": point.name,
                "location": {"lat": point.location.lat,"lon": point.location.lon},
                "weight": point.weight * 200
            }))
        };

        const updatedSchema = {...data, heatmaps: [heatMapObject]};
        console.log("updatedSchema")
        console.log(updatedSchema)

        store.updateMapSchema(mapid, updatedSchema);
        setData(updatedSchema);
        renderHeatSchemaToHeatMap(updatedSchema);

    }
/*-----------------------------heatmap-----------------------------------*/
    const handleFileUpload = async (event) => {
        console.log("file upload called");
        const files = Array.from(event.target.files);
        if (!files.length) return;
        let geojsonData;

        if (files.length === 1) {
            const file = files[0];
            if (file.name.endsWith('.kml')) {
                // Parse KML or GeoJSON file
                const text = await file.text();
                const parser = new DOMParser();
                const kml = parser.parseFromString(text, 'text/xml');
                geojsonData = togeojson.kml(kml);
                RenderNewGeoJSON(geojsonData);// render the geojsonData to map
            }
            else if (file.name.endsWith('.json') || file.name.endsWith('.geojson')) {
                // Parse GeoJSON file
                geojsonData = JSON.parse(await file.text());
                console.log(geojsonData);
                const validate = ajv.compile(SCHEMA);
                if (!validate(geojsonData)) { // Does not match map schema, is a geojson file
                    RenderNewGeoJSON(geojsonData);// render the geojsonData to map
                    console.log(validate.errors);
                } else {
                    // Is a map schema file
                    setData(geojsonData);
                    await store.updateMapSchema(mapid, geojsonData);
                    drawSubdivisions(geojsonData);
                    loadPoints(geojsonData?.points);
                }
                return;
            }
            else if (file.name.endsWith('.shp')) {
                const shpReader = new FileReader();
                shpReader.onload = (shpEvent) => {
                    const shpArrayBuffer = shpEvent.target.result;
                    shapefile.read(shpArrayBuffer).then((result) => {
                        geojsonData = { type: 'FeatureCollection', features: result.features };
                        RenderNewGeoJSON(geojsonData);// render the geojsonData to map
                    }).catch((error) => {
                        console.error('Error reading Shapefile', error);
                    });
                };
                shpReader.readAsArrayBuffer(file);
            }
            // if the file type is .csv
            else if(file.name.endsWith('.csv')){
                console.log("csv file received, mapid: "+mapid);
                console.log("current map schema:" + data);
                
                const currentMapSchema = data;
                
                if (currentMapSchema.type) {
                    // change the map schema type to heatmap
                    currentMapSchema.type = "heatmap";

                    const csvText = await file.text();
                    const heatMapData = parseCSVForHeatMap(csvText);
                    console.log(heatMapData)
                    const heatMapObject = createHeatMapObject(heatMapData);

                    const updatedSchema = {...data, heatmaps: [heatMapObject]};
                    console.log("updatedSchema")
                    console.log(updatedSchema)

                    store.updateMapSchema(mapid, updatedSchema);
                    setData(updatedSchema);
                    renderHeatSchemaToHeatMap(updatedSchema);
                }
            }

        }else if (files.length === 2) {
            const validExtensions = ['shp', 'shx', 'dbf'];
            const fileExtensions = Array.from(files).map(file => file.name.split('.').pop().toLowerCase());
            if (!fileExtensions.every(ext => validExtensions.includes(ext))) {
                alert('please upload .shp, .shx, and .dbf files');
                return;
            }
            const shpFile = files.find(file => file.name.endsWith('.shp'));
            const dbfFile = files.find(file => file.name.endsWith('.dbf'));
            if (!shpFile || !dbfFile) {
                alert('Both .shp and .dbf files are required');
                return;
            }
            const shpReader = new FileReader();
            shpReader.onload = (shpEvent) => {
                const shpArrayBuffer = shpEvent.target.result;
                const dbfReader = new FileReader();
                dbfReader.onload = (dbfEvent) => {
                    const dbfArrayBuffer = dbfEvent.target.result;
                    shapefile.read(shpArrayBuffer, dbfArrayBuffer).then((result) => {
                        geojsonData = { type: 'FeatureCollection', features: result.features };
                        RenderNewGeoJSON(geojsonData);
                    }).catch((error) => {
                        console.error('Error reading Shapefile', error);
                    });
                };
                dbfReader.readAsArrayBuffer(dbfFile);
            };
            shpReader.readAsArrayBuffer(shpFile);
        } else {
            alert('not supported importing');
        }
    }

    // Handles redrawing subdivision coloring when schema is updated
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

    // Handles redrawing points when schema is updated
    const loadPoints = (points) => {
        let newMarkers = []; // Store working set of markers, can't use state variable marker because it is snapshot
        markerLayerRef.current.clearLayers(); // Clear existing markers
        points?.forEach(point => {
            const marker = L.circleMarker([point.location.lat, point.location.lon], {
                radius: point.weight * 15
            }).addTo(markerLayerRef.current); // Add new marker
            marker.setStyle({fillColor: point.color || '#000000', fillOpacity: 1, stroke: false}); // Set color and size of marker
            marker.on('click', function (e) {
                L.DomEvent.stopPropagation(e) // Prevent click from propagating to map
                console.log(point);
                setCurrentPoint(point);
                store.setMapData(map); // Forces a rerender by updating store
                setSidebar('point');
            });
            newMarkers.push(marker);
        })
        setMarkers(newMarkers); // Update state variable
    }

    // Handles redrawing legend when schema is updated
    const drawLegend = (resp2) => {
        if (!legendRef.current) return;
        legendRef.current.remove();
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
                                <Typography sx={{ marginLeft: '5px', marginRight: 'auto', color: '#FFFFFF', fontFamily: 'JetBrains Mono'}} noWrap={true}>{level.value.toFixed(2)}</Typography>
                            </Box>

                        ))]
                    }))]
                )
            )
            return div;
        }
        legend.addTo(mapRef.current); // Add legend to map
        legendRef.current = legend; // Store legend in ref
    }

    // Handles refetching the map and schema data when something changes
    useEffect(() => {
        const fetchMap = async () => {
            const resp = await store.getMap(mapid);
            if (resp) {
                setMap(resp);
                if (!resp.mapSchema && data === null) return setData({ // If map has no schema, create a new one
                    "type": "none",
                    "bins": [],
                    "subdivisions": [],
                    "points": [],
                    "gradients": [],
                    "heatmaps": [],
                    "showSatellite": false
                });
              
                const resp2 = await store.getSchema(resp.mapSchema, true);
                console.log("wow");
                console.log(resp2)
                if (!resp2) return setData({ // If map has no schema, create a new one
                    "type": "none",
                    "bins": [],
                    "subdivisions": [],
                    "points": [],
                    "gradients": [],
                    "heatmaps": [],
                    "showSatellite": false
                });
                /* store.setSchemaData(resp2?.schema); */
                setData(resp2);
                console.log(resp2)

                // Draw subdivisions, points, and legend
                drawSubdivisions(resp2);
                loadPoints(resp2?.points);
                setShowSatellite(resp2?.showSatellite);
                renderHeatSchemaToHeatMap(resp2);
                drawLegend(resp2);
            }
        }
        fetchMap();
    }, [store, mapid]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handles fetching and initializing the map and adding initial event listeners
    useEffect(() => {
        if (!mapInitializedRef.current) { // Initialize map if it hasn't been initialized yet
            mapRef.current = L.map(mapRef.current).setView([0, 0], 2); // Initialize Leaflet map with default view/zoom
            /* L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current); */ // Add OpenStreetMap tiles
            satelliteLayerRef.current = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{ 
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
        if (!markerLayerRef.current) markerLayerRef.current = L.featureGroup().addTo(mapRef.current); // Initialize marker layer
        fetch(`${map?.mapFile}?${SASTOKEN}`, {mode: "cors"}) // Fetch GeoJSON data
            .then((response) =>  response.json()) // Parse response as JSON
            .then((geojson) => {
                if (geoJSONLayerRef.current) geoJSONLayerRef.current.clearLayers(); // Remove existing GeoJSON layer
                else geoJSONLayerRef.current = L.geoJSON(geojson,{
                    onEachFeature: function(feature, layer) {onEachFeature(feature, layer, mapEditMode)}
                }).addTo(mapRef.current); // Add new GeoJSON layer
                geoJSONLayerRef.current.addData(geojson); // Add GeoJSON data to layer
                if (data) drawSubdivisions(data); // Draw subdivisions
                mapRef.current.on('click', addPointCallback); // Add click handler for adding points
            }).catch((error) => {
                console.error('Error reading GeoJSON', error);
            });
        satelliteLayerRef?.current?.setOpacity(showSatellite ? 1 : 0); // Set satellite layer opacity depending on satellite view
        return () => { if (geoJSONLayerRef.current) geoJSONLayerRef.current.clearLayers();  }; // Remove GeoJSON layer on unmount
    }, [map?.mapFile, showSatellite]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handles keyboard shortcuts, only activates on mount/unmount
    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'Escape': { // Escape cancels any edit mode
                    setMapEditMode('None');
                    break;
                }
                case 's': { // Ctrl + s saves map
                    if (e.ctrlKey) {
                        e.preventDefault();
                        store.saveMapSchema(mapid, store.getSchema(mapid, true));
                        setOpenSnackbar(true);
                        setSnackbarMessage('Map saved');
                        setSnackbarSeverity('success');
                        setSnackbarAutoHide(5000);
                    }
                    break;
                }
                case 'z': { // Ctrl + z undoes
                    if (e.ctrlKey) {
                        e.preventDefault();
                        store.undo();
                    }
                    break;
                }
                case 'Z': { // Ctrl + shift + z redoes
                    if (e.ctrlKey && e.shiftKey) {
                        e.preventDefault();
                        store.redo();
                    }
                    break;
                }
                case 'y': { // Ctrl + y also redoes
                    if (e.ctrlKey) {
                        e.preventDefault();
                        store.redo();
                    }
                    break;
                }
                default: {}
            }
        }
        document.addEventListener('keydown', handleKeyDown); // Install event listener

        return () => { // Cleanup on unmount
            document.removeEventListener('keydown', handleKeyDown); // Remove event listener on unmount as to not interfere with other pages
            store.clearHistory(); // Clear history in memory on unmount
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function panToPoint(lat, lon) {
        mapRef.current?.setView([lat, lon], mapRef.current?.getZoom() * 1.05);
    }

    function changeTemplate(name) {
        if(name.split(" ")[0].toLowerCase() === data.type || (data.type === 'heatmap' && name === "Heat Map")) {
            setData({...data, type: 'none'})
            return
        }
        if(name === "Bin Map") {
            setSidebar('bin')
            store.updateMapSchema(mapid, {...data, type: 'bin'})
        } else if(name === "Gradient Map") {
            setSidebar('gradient')
            store.updateMapSchema(mapid, {...data, type: 'gradient'})
        } else if(name === "Heat Map") {
            setSidebar('heatmap')
            store.updateMapSchema(mapid, {...data, type: 'heatmap'})
        } else if(name === "Point Map") {
            setSidebar('point')
            store.updateMapSchema(mapid, {...data, type: 'point'})
        } else if(name === "Satellite Map") {
            setSidebar('map')
            store.updateMapSchema(mapid, {...data, type: 'satellite'})
        }
    }

    async function exportJSON() {
        saveAs(`${map?.mapFile}?${SASTOKEN}`, map.title + ".json")
        delete data._id
        delete data.__v
        console.log(data)
        var blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, map.title + "_schema.json")
    }


    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box height='80vh' width='100vw' style={{ flex: 1 }} >
                {/* Toolbar */}
                <AppBar position="static" style={{ background: 'transparent', zIndex: 2000 }}>
                    <Toolbar sx={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 2 }}>
                        <Box sx={{ marginRight: 'auto', backgroundColor: '#DDDDDD', borderRadius: '20px', minWidth: '460px', maxWidth: '460px' }}>
                        <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple onClick={() => document.getElementById('file-input').click()}>Import</Button>
                            <input type="file" id="file-input" style={{ display: 'none' }} accept=".kml,.shp,.shx,.dbf,.json,.geojson,.csv" multiple onChange={handleFileUpload} />

                            
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple onClick={() => exportJSON()}>Export</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple onClick={() => store.openModal('publishMap')}>Publish</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple onClick={() => store.openModal('deleteMap')}>Delete</Button>
                        </Box>

                        {/* Toolbar Buttons */}
                        <Box sx={{ marginRight: '20%', backgroundColor: '#DDDDDD', borderRadius: '20px', minWidth: '875px', maxWidth: '875px' }}>
                            <Button variant="text" sx={styles.sxOverride} style={sidebar === 'map' ? styles.bigButtonSelected : styles.bigButton} disableRipple onClick={() => {setSidebar('map'); store.setMapData(map);}}>Map Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={sidebar === 'subdivision' ? styles.bigButtonSelected : styles.bigButton} disableRipple onClick={() => {setSidebar('subdivision'); setFeature(null)}}>Subdivisions</Button>
                            <Button variant="text" sx={styles.sxOverride} style={sidebar === 'point' ? styles.bigButtonSelected : styles.bigButton} disableRipple onClick={() => {setSidebar('point'); setCurrentPoint(null)}}>Points</Button>
                            <Button variant="text" sx={styles.sxOverride} style={sidebar === 'heatmap' ? styles.bigButtonSelected : styles.bigButton} disableRipple onClick={() => {setSidebar('heatmap')}}>Heat Map</Button>
                            <Button variant="text" sx={styles.sxOverride} style={sidebar === 'bin' ? styles.bigButtonSelected : styles.bigButton} disableRipple onClick={() => setSidebar('bin')}>Bins</Button>
                            <Button variant="text" sx={styles.sxOverride} style={sidebar === 'gradient' ? styles.bigButtonSelected : styles.bigButton} disableRipple onClick={() => setSidebar('gradient')}>Gradients</Button>
                            <Button variant="text" sx={styles.sxOverride} style={sidebar === 'template' ? styles.bigButtonSelected : styles.bigButton} disableRipple onClick={() => setSidebar('template')}>Templates</Button>
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
                
                {/* Sidebar Buttons */}
                <Box sx={styles.toolbarBG}>
                    <IconButton sx={styles.sxOverride} style={{...styles.toolbarButton}}
                        onClick={() => {
                            store.undo();
                        }}
                    ><ReplayIcon/></IconButton>
                    <IconButton sx={styles.sxOverride} style={{...styles.toolbarButton, top:'40px'}}
                        onClick={() => {
                            store.redo();
                        }}
                    ><ReplayIcon sx={{ transform: 'scaleX(-1)' }} /></IconButton>
                    <IconButton sx={styles.sxOverride} style={{...styles.toolbarButton, top:'80px'}}
                        onClick={async () => {
                            await store.saveMapSchema(mapid, store.getSchema(mapid,true));
                            setOpenSnackbar(true);
                            setSnackbarMessage('Map saved');
                            setSnackbarSeverity('success');
                            setSnackbarAutoHide(5000);
                        }}
                    ><SaveIcon/></IconButton>
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

                {sidebar === 'map' && <MapSidebar mapData={map} mapSchema={data} setShowSatellite={setShowSatellite}/>}
                {sidebar === 'subdivision' && <SubdivisionSidebar mapData={map} currentFeature={feature} mapSchema={data} setFeature={setFeature}/>}
                {sidebar === 'point' && <PointSidebar mapData={map} currentPoint={currentPoint} mapSchema={data} setMapEditMode={setMapEditMode} setCurrentPoint={setCurrentPoint} panToPoint={panToPoint}/>}
                {sidebar === 'bin' && <BinSidebar mapData={map} mapSchema={data} setMapEditMode={setMapEditMode}/>}
                {sidebar === 'gradient' && <GradientSidebar mapData={map} mapSchema={data} setMapEditMode={setMapEditMode}/>}
                {sidebar === 'heatmap' && <HeatMapSidebar mapSchema={data} onHeatMapChange={handleHeatMapChange} uploadCSV={handleFileUpload} clearHeatMap={clearHeatMap} heatExistingPoints={heatExistingPoints}/>}
                {sidebar === 'template' && <TemplateSidebar mapSchema={data} changeTemplate={changeTemplate}/>}

            </Drawer>
            <ConfirmModal map={map}/>
            <Snackbar open={openSnackbar} autoHideDuration={snackbarAutoHide} onClose={(event, reason) => {
                if (reason === 'clickaway' || reason === 'escapeKeyDown') return;
                setOpenSnackbar(false);
                if (mapEditMode !== 'None') setMapEditMode('None');
            }} anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}>
                <Alert action={null} onClose={() => {
                    setOpenSnackbar(false);
                    if (mapEditMode !== 'None') setMapEditMode('None');
                }} severity={snackbarSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert>
            </Snackbar>
        </Box>
    );
}
