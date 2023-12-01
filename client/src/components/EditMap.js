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
import ConfirmModal from './ConfirmModal';
import togeojson from 'togeojson';
import * as shapefile from 'shapefile';


export default function EditMap({ mapid }) {
    const [openDrawer, setOpenDrawer] = useState(true);
    const [sidebar, setSidebar] = useState('map');
    const [map, setMap] = useState(null);
    const [feature, setFeature] = useState(null);
    const [data, setData] = useState(null); // eslint-disable-line
    const mapRef = useRef(null); // Track map instance
    const geoJSONLayerRef = useRef(null); // Track GeoJSON layer instance
    const mapInitializedRef = useRef(false); // Track whether map has been initialized
    const { store } = useContext(GlobalStoreContext); // eslint-disable-line
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
      });
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
    /*---------------------------------------------------*/
    const updateMapWithGeoJSON = (geojsonData) => {
        if (geoJSONLayerRef.current) {
            geoJSONLayerRef.current.clearLayers(); 
        }
        geoJSONLayerRef.current = L.geoJSON(geojsonData,{onEachFeature:onEachFeature}).addTo(mapRef.current);
    
    };

    function onEachFeature(feature, layer) {
        var popupcontent = [];
        for (var prop in feature.properties) {
            popupcontent.push(prop + ": " + feature.properties[prop]);
        }
        if(popupcontent.length !== 0) {
        layer.bindPopup(popupcontent.join("<br/>"), {maxHeight: 200, maxWidth: 200});
    
        // Add mouseover and mouseout event listeners
        layer.on('click', function() {
            console.log(feature.properties);
            setFeature(feature.properties);
            store.setSchemaData(data);
            store.setMapData(map);
            setSidebar('subdivision');
            layer.openPopup();
        });
        layer.on('mouseout', function() {
            layer.closePopup();
        });
        }
    }
    /*---------------------------------------------------*/
    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;
        let geojsonData;

        if (files.length === 1){
            const file = files[0];
            if (file.name.endsWith('.kml')) {
                // Parse KML or GeoJSON file
                const text = await file.text();
                const parser = new DOMParser();
                const kml = parser.parseFromString(text, 'text/xml');
                geojsonData = togeojson.kml(kml);
                updateMapWithGeoJSON(geojsonData);// render the geojsonData to map
                // Next:
                // need to write a function store the geojsonData to database

            }
            else if (file.name.endsWith('.json') || file.name.endsWith('.geojson')) {
                // Parse GeoJSON file
                geojsonData = JSON.parse(await file.text());
                updateMapWithGeoJSON(geojsonData);// render the geojsonData to map
                // Next:
                // need to write a function store the geojsonData to database
            }
            else if (file.name.endsWith('.shp')) {
                const shpReader = new FileReader();
                shpReader.onload = (shpEvent) => {
                const shpArrayBuffer = shpEvent.target.result;
                    shapefile.read(shpArrayBuffer).then((result) => {
                        geojsonData = { type: 'FeatureCollection', features: result.features };
                        updateMapWithGeoJSON(geojsonData);// render the geojsonData to map
                        // Next:
                        // need to write a function store the geojsonData to database
                    }).catch((error) => {
                        console.error('Error reading Shapefile', error);
                    });
                };
                shpReader.readAsArrayBuffer(file); 

        }
        else if (files.length === 2) {
            const validExtensions = ['shp', 'shx', 'dbf'];
            const fileExtensions = Array.from(files).map(file => file.name.split('.').pop().toLowerCase());
            if (!fileExtensions.every(ext => validExtensions.includes(ext))) {
                alert('please upload .shp, .shx, and .dbf files');
                return;
            }
            const shpFile = files.find(file => file.name.endsWith('.shp'));
            const dbfFile = files.find(file => file.name.endsWith('.dbf'));
            if (!shpFile || !dbfFile) {alert('Both .shp and .dbf files are required');
                return;
            }
            const shpReader = new FileReader();
                shpReader.onload = (shpEvent) => {
                    const shpArrayBuffer = shpEvent.target.result;
            const dbfReader = new FileReader();
                dbfReader.onload = (dbfEvent) => {
                    const dbfArrayBuffer = dbfEvent.target.result;
                    shapefile.read(shpArrayBuffer, dbfArrayBuffer).then((result) => {
                        // geojsonData = { type: 'FeatureCollection', features: result.features };
                        console.log("WROOOOOO"); //not print out in console
                        console.log(result);    //not print out in console
                        geojsonData = result;
                        
                        updateMapWithGeoJSON(geojsonData);
                    }).catch((error) => {
                        console.error('Error reading Shapefile', error);
                    });
                };
                dbfReader.readAsArrayBuffer(dbfFile);
            };
            shpReader.readAsArrayBuffer(shpFile);
        }else{
            alert('not supported files');
        }
    };
    }
    useEffect(() => {
        const fetchMap = async () => {
            const resp = await store.getMap(mapid);
            console.log(resp)
            if (resp) {
                setMap(resp);
            }
        }
        fetchMap();
    }, [store, mapid]);

    useEffect(() => {
        if (!mapInitializedRef.current) { // Initialize map if it hasn't been initialized yet
            mapRef.current = L.map(mapRef.current).setView([0, 0], 2); // Initialize Leaflet map with default view/zoom
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current); // Add OpenStreetMap tiles
            L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{ subdomains:['mt0','mt1','mt2','mt3']}).addTo(mapRef.current); // Add Google Satellite tiles
            mapInitializedRef.current = true; // Mark map as initialized
        }

        fetch("brazil-states.json")
            .then((response) => response.json())
            .then((geojson) => {
                if (geoJSONLayerRef.current) geoJSONLayerRef.current.clearLayers(); // Remove existing GeoJSON layer
                else geoJSONLayerRef.current = L.geoJSON(geojson,{onEachFeature:onEachFeature}).addTo(mapRef.current); // Add new GeoJSON layer
                geoJSONLayerRef.current.addData(geojson); // Add GeoJSON data to layer
            }).catch((error) => {
                console.error('Error reading GeoJSON', error);
            });

        return () => { if (geoJSONLayerRef.current) geoJSONLayerRef.current.clearLayers(); }; // Remove GeoJSON layer on unmount
    });

    function handlePublishModal() {
        store.openModal();
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box height='80vh' width='100vw' style={{ flex: 1 }} >
                {/* Toolbar */}
                <AppBar position="static" style={{ background: 'transparent', zIndex: 2000 }}>
                    <Toolbar sx={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 2 }}>
                        <Box sx={{ marginRight: 'auto', backgroundColor: '#DDDDDD', borderRadius: '20px', minWidth: '460px', maxWidth: '460px' }}>
                        <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple onClick={() => document.getElementById('file-input').click()}>Import</Button>
                            <input type="file" id="file-input" style={{ display: 'none' }} accept=".kml,.shp,.shx,.dbf,.json,.geojson" multiple onChange={handleFileUpload} />

                            
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple>Export</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple onClick={handlePublishModal}>Publish</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple>Delete</Button>
                        </Box>
                        <Box sx={{ marginRight: '20%', backgroundColor: '#DDDDDD', borderRadius: '20px', minWidth: '870px', maxWidth: '870px' }}>
                            <Button variant="text" sx={styles.sxOverride} style={styles.bigButton} disableRipple onClick={() => {setSidebar('map'); store.setMapData(map);}}>Map Info</Button>
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
                {sidebar === 'map' && <MapSidebar mapData={map}/>}
                {sidebar === 'subdivision' && <SubdivisionSidebar mapData={map} currentFeature={feature}/>}
                {sidebar === 'point' && <PointSidebar />}
                {sidebar === 'bin' && <BinSidebar />}
                {sidebar === 'gradient' && <GradientSidebar />}
                {sidebar === 'template' && <TemplateSidebar />}
            </Drawer>
            <ConfirmModal map={map}/>
        </Box>
    );
}