import React, { useState, useEffect, useContext, useRef } from 'react';
import { GlobalStoreContext } from '../store';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'; // eslint-disable-line
import { IconButton, Box, AppBar, Toolbar, Button, Drawer } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import SaveIcon from '@mui/icons-material/Save';
import L, { heatLayer } from 'leaflet';
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
const Ajv = require('ajv');
const ajv = new Ajv();

const SASTOKEN = 'sp=r&st=2023-12-03T19:46:53Z&se=2025-01-09T03:46:53Z&sv=2022-11-02&sr=c&sig=LL0JUIq%2F3ZfOrYW8y4F4lk67ZXHFlGdmY%2BktKsHPkss%3D';
const SCHEMA = {  
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
          "affectedBins": {
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
        "enum": [ "bin", "gradient", "heatmap", "point", "satellite" ]
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
        color: '#E3256B'
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

export default function EditMap({ mapid }) {
    const [openDrawer, setOpenDrawer] = useState(true);
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

    function onEachFeature(feature, layer, editMode) {
        layer.on('click', function() { 
            if (editMode !== 'None') return;
            console.log(feature.properties);
            setFeature(feature.properties);
            store.setMapData(map);
            setSidebar('subdivision');
        });
    }

    useEffect(() => {
        console.log("map edit mode changed to " + mapEditMode);
        if (!mapRef.current || !geoJSONLayerRef.current) return;
        if (mapEditMode === 'DeletePoint') {
            setSidebar('map');
            const newPoints = data?.points.filter(point => point.name !== currentPoint.name);
            console.log(newPoints);
            loadPoints(newPoints);
            return setMapEditMode('None');
        } else if (mapEditMode === 'MovePoint') {
            mapRef.current?.off('click');
            mapRef.current?.on('click', async function(e) {
                if (mapEditMode !== 'MovePoint') return console.log(mapEditMode);
                console.log(e.latlng.lat, e.latlng.lng);
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;
                const existing = data?.points?.find(point => point.name === currentPoint.name);
                if (existing) { // Technically this should always be true
                    const newPoint = {
                        ...existing,
                        location: {lat: lat, lon: lng}, 
                    };
                    console.log(newPoint);
                    const newPoints = data.points.map(point => {
                        return point.name === currentPoint.name ? newPoint : point;
                    });
                    const updatedSchema = {...data, points: newPoints};
                    await store.updateMapSchema(mapid, updatedSchema);
                    loadPoints(newPoints);
                    /* console.log(newPoints); */
                    /* setData(updatedSchema); */
                    setCurrentPoint(newPoint);
                    return setMapEditMode('None');
                }
            });
            geoJSONLayerRef.current?.eachLayer((layer) => {
                layer.off('click');
                layer.on('click', function() { 
                    console.log(mapEditMode);
                    if (mapEditMode !== 'None') return;
                    console.log(layer.feature.properties);
                    setFeature(layer.feature.properties);
                    store.setMapData(map);
                    setSidebar('subdivision');
                });
            });
        } else if (mapEditMode === 'AddPoint') {
            mapRef.current?.off('click');
            mapRef.current?.on('click', function(e) {
                if (mapEditMode !== 'AddPoint') return console.log(mapEditMode);
                console.log(e.latlng.lat, e.latlng.lng);
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;
                const newPoint = {
                    name: lat.toFixed(4) + ', ' + lng.toFixed(4),
                    location: {lat: lat, lon: lng}, 
                    weight: 0.5};
                const newPoints = [...data?.points, newPoint];
                /* markers.forEach(marker => {console.log("Removing ", marker); geoJSONLayerRef.current.removeLayer(marker)}); */
                loadPoints(newPoints);
                setMapEditMode('None');
                console.log("wow" + mapEditMode)
                store.updateMapSchema(mapid, {...data, points: newPoints});
            });
            geoJSONLayerRef.current?.eachLayer((layer) => {
                layer.off('click');
                layer.on('click', function() { 
                    console.log(mapEditMode);
                    if (mapEditMode !== 'None') return;
                    console.log(layer.feature.properties);
                    setFeature(layer.feature.properties);
                    store.setMapData(map);
                    setSidebar('subdivision');
                });
            });
        } else {
            mapRef.current?.off('click');
            mapRef.current?.on('click');
            geoJSONLayerRef.current?.eachLayer((layer) => {
                layer.off('click');
                layer.on('click', function() { 
                    console.log(mapEditMode);
                    if (mapEditMode !== 'None') return;
                    console.log(layer.feature.properties);
                    setFeature(layer.feature.properties);
                    store.setMapData(map);
                    setSidebar('subdivision');
                });
            });
        }
    }, [mapEditMode]) // eslint-disable-line react-hooks/exhaustive-deps

    function addPointCallback (e) {
            /* console.log("click"); */
            if (mapEditMode === 'None') {   
                return setCurrentPoint(null)
            }
            if (mapEditMode !== 'AddPoint') return console.log(mapEditMode);
            console.log(e.latlng.lat, e.latlng.lng);
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            const newPoint = {
                name: lat.toFixed(4) + ', ' + lng.toFixed(4),
                location: {lat: lat, lon: lng}, 
                weight: 0.5};
            const newPoints = [...data?.points, newPoint];
            /* markers.forEach(marker => mapRef.current.removeLayer(marker)); */
            loadPoints(newPoints);
            /* console.log(newPoints); */
            setMapEditMode('None');
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
        if (radius === undefined) { radius = 26;}
        if (blur === undefined) {blur = 19;}

        // if radius, blur != null , use given values
        const heatMapObject = {
            "radius": radius, "blur": blur,
            "points": pointsArrayData.map(([lat, lng], index) => ({
                "name": "point" + index,
                "location": {"lat": lat,"lon": lng},
                "weight": 1
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
            const heatLayer = L.heatLayer(pointsArrayData, { radius: 26, blur: 19 }).addTo(mapRef.current);
            console.log("Render points Array with unspecified radius or blur: heat layer:");
            console.log(heatLayer);
            heatLayerRef.current = heatLayer;
        }
        // if the radius and blur are specified, use the specified values
        else {
            if (heatLayerRef.current) {
                mapRef.current.removeLayer(heatLayerRef.current);
            }
            const heatLayer = L.heatLayer(pointsArrayData, { radius: radius, blur: blur }).addTo(mapRef.current);
            console.log("Render points Array with given radius and blur: heat layer:");
            console.log(heatLayer);
            heatLayerRef.current = heatLayer;
        }
    }
   // render current map schema's heatmap block to heatmap
    function renderHeatSchemaToHeatMap(mapSchema) {
        console.log("Entering: renderHeatSchemaToHeatMap");
        if (mapSchema.type === 'heatmap' && mapSchema.heatmaps) {
            console.log("process map schema, extract heatmap's data:");
            const heatMap = mapSchema.heatmaps[0];
            console.log(heatMap);
            const radius = heatMap.radius;
            const blur = heatMap.blur;
            const pointsArrayData = heatMap.points.map(point => [point.location.lat, point.location.lon, point.weight]);
            console.log(" Transfer heatmap's data to 'renderPArrayToHeatMap': ");
            renderPArrayToHeatMap(pointsArrayData, radius, blur);
        }
        return null;
    }

    const handleHeatMapChange = async(radius, blur) => {
        console.log("Handle Change radius blur : current map schema:");
        const data = await store.getSchema(mapid);
        const currentMapSchema = {...data};
        console.log(currentMapSchema);
        if (!currentMapSchema.heatmaps || currentMapSchema.heatmaps.length === 0) {
            console.log("Handle: no heatmap in current map schema");
            currentMapSchema.heatmaps = [];
        }

        console.log("Handle2: handleHeatMapChange = (radius, blur) :current map schema.heatmaps[0]:");
        console.log(currentMapSchema.heatmaps[0]);

        console.log("Input radius blur:" + radius + "|||| " + blur)

        currentMapSchema.heatmaps[0].radius = radius;
        currentMapSchema.heatmaps[0].blur = blur;

        console.log("Handle3: handleHeatMapChange = (radius, blur) :current map schema.heatmaps[0]:");
        console.log(currentMapSchema.heatmaps[0]);

        console.log("Handle4 Changed map schema: ");
        console.log(currentMapSchema);

        const changedMapSchema = {...currentMapSchema};


        // console.log("Handle5: Updated map schema:"+"   " + updatedSchema);


        setData(changedMapSchema);

        console.log("Handle6: current Data:");
        console.log(data);
        // store.updateMapSchema(mapid, data);

        if (heatLayerRef.current) {
            heatLayerRef.current.setOptions({radius:radius, blur:blur});
            heatLayerRef.current.redraw();
        }
    };
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
                
                // if (currentMapSchema.type !== "heatmap" ) {

                if (currentMapSchema.type) {
                    // change the map schema type to heatmap
                    currentMapSchema.type = "heatmap";

                    const csvText = await file.text();
                    const heatMapData = parseCSVForHeatMap(csvText);

                    // renderPArrayToHeatMap(heatMapData);
                    const heatMapObject = createHeatMapObject(heatMapData);

                    const updatedSchema = {...data, heatmaps: [heatMapObject]};
                    // data.heatmaps = []
                    // data.heatmaps.push(heatMapObject);

                    console.log("Handle Before Updated map schema:" + mapid +"   " + data);

                    store.updateMapSchema(mapid, updatedSchema);
                    setData(updatedSchema);
                    renderHeatSchemaToHeatMap(updatedSchema);

                    console.log("Handle After Updated map schema:" + mapid +"   " + data);
                
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

    const drawSubdivisions = (resp2) => {
        if (geoJSONLayerRef.current){
            /* console.log("drawing subdivisions with data", resp2?.subdivisions); */
            geoJSONLayerRef.current.eachLayer((layer) => {
                const existing = resp2?.subdivisions?.find(subdivision => 
                    subdivision.name === layer.feature.properties.name || 
                    subdivision.name === layer.feature.properties.NAME || 
                    subdivision.name === layer.feature.properties.Name
                );
                layer.setStyle({fillColor: existing?.color || '#DDDDDD', fillOpacity: existing?.weight || 0.5});
            } );
        }
        if (markerLayerRef?.current) markerLayerRef.current.bringToFront();
    }
    const loadPoints = (points) => {
        let newMarkers = [];
        /* markers.forEach(marker => {console.log("Removing ", marker);  */markerLayerRef.current.clearLayers();/* }); */
        points?.forEach(point => {
            const marker = L.circleMarker([point.location.lat, point.location.lon], {
                radius: point.weight * 15
            }).addTo(markerLayerRef.current);
            /* console.log("Adding ", marker); */
            marker.setStyle({fillColor: point.color || '#000000', fillOpacity: 1, stroke: false});
            marker.on('click', function (e) {
                L.DomEvent.stopPropagation(e)
                console.log(point);
                setCurrentPoint(point);
                store.setMapData(map);
                setSidebar('point');
            });
            /* newMarkers =  */newMarkers.push(marker);
            /* newMarkers = [...newMarkers, marker]; */
        })
        setMarkers(newMarkers);
    }
    useEffect(() => {
        const fetchMap = async () => {
            const resp = await store.getMap(mapid);
            if (resp) {
                setMap(resp);
                if (!resp.mapSchema) return setData({
                    "type": "bin",
                    "bins": [],
                    "subdivisions": [],
                    "points": [],
                    "gradients": [],
                    "showSatellite": true
                });
                const resp2 = await store.getSchema(resp.mapSchema);
                // console.log("resp2 MAPSCHEMA");
                // console.log(resp2);
                if (!resp2) return setData({
                    "type": "bin",
                    "bins": [],
                    "subdivisions": [],
                    "points": [],
                    "gradients": [],
                    "showSatellite": true
                });
                /* store.setSchemaData(resp2?.schema); */
                setData(resp2);
                drawSubdivisions(resp2);
                loadPoints(resp2?.points);
                setShowSatellite(resp2?.satelliteView);
    
            }
        }
        fetchMap();
    }, [store, mapid]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!mapInitializedRef.current) { // Initialize map if it hasn't been initialized yet
            mapRef.current = L.map(mapRef.current).setView([0, 0], 2); // Initialize Leaflet map with default view/zoom
            //L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current); // Add OpenStreetMap tiles
            satelliteLayerRef.current = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{ 
                subdomains:['mt0','mt1','mt2','mt3']
            }).addTo(mapRef.current); // Add Google Satellite tiles
            mapInitializedRef.current = true; // Mark map as initialized
        }
        if (!markerLayerRef.current) markerLayerRef.current = L.featureGroup().addTo(mapRef.current); // Initialize marker layer
        fetch(`${map?.mapFile}?${SASTOKEN}`, {mode: "cors"})
            .then((response) =>  response.json())
            .then((geojson) => {
                if (geoJSONLayerRef.current) geoJSONLayerRef.current.clearLayers(); // Remove existing GeoJSON layer
                else geoJSONLayerRef.current = L.geoJSON(geojson,{
                    onEachFeature: function(feature, layer) {onEachFeature(feature, layer, mapEditMode)}
                }).addTo(mapRef.current); // Add new GeoJSON layer
                geoJSONLayerRef.current.addData(geojson); // Add GeoJSON data to layer
                if (data) drawSubdivisions(data);
                mapRef.current.on('click', addPointCallback);
            }).catch((error) => {
                console.error('Error reading GeoJSON', error);
            });
        satelliteLayerRef?.current?.setOpacity(showSatellite ? 1 : 0);
        return () => { if (geoJSONLayerRef.current) geoJSONLayerRef.current.clearLayers();  }; // Remove GeoJSON layer on unmount
    }, [map?.mapFile, showSatellite]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'Escape': {
                    setMapEditMode('None');
                    break;
                }
                case 's': {
                    if (e.ctrlKey) {
                        e.preventDefault();
                        console.log('saving');
                        store.saveMapSchema(mapid, store.getSchema(mapid));
                        alert('Map saved');
                    }
                    break;
                }
                case 'z': {
                    if (e.ctrlKey) {
                        e.preventDefault();
                        store.undo();
                    }
                    break;
                }
                case 'Z': {
                    if (e.ctrlKey && e.shiftKey) {
                        e.preventDefault();
                        store.redo();
                    }
                    break;
                }
                case 'y': {
                    if (e.ctrlKey) {
                        e.preventDefault();
                        store.redo();
                    }
                    break;
                }
                default: {}
            }
        }
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            store.clearHistory();
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleDelete = async () => {
        console.log('delete map called on ' + mapid);
        const resp = await store.deleteMap(mapid);
        console.log(resp);
    }

    const handleTemplateSelect = (templateName) => {
        if (templateName === 'Heat Map') {
            setSidebar('heatmap');
        }
        // if (templateName === 'Point Map') {
        //     setSidebar('point');
        // }
        // if (templateName === 'Satellite Map') {
        //     setSidebar('satellite');
        // }

        // if (templateName === 'Bin Map') {
        //     setSidebar('bin');
        // }
        // if (templateName === 'Gradient Map') {
        //     setSidebar('gradient');
        // }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box height='80vh' width='100vw' style={{ flex: 1 }} >
                {/* Toolbar */}
                <AppBar position="static" style={{ background: 'transparent', zIndex: 2000 }}>
                    <Toolbar sx={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 2 }}>
                        <Box sx={{ marginRight: 'auto', backgroundColor: '#DDDDDD', borderRadius: '20px', minWidth: '460px', maxWidth: '460px' }}>
                        <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple onClick={() => document.getElementById('file-input').click()}>Import</Button>
                            <input type="file" id="file-input" style={{ display: 'none' }} accept=".kml,.shp,.shx,.dbf,.json,.geojson,.csv" multiple onChange={handleFileUpload} />

                            
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple>Export</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple onClick={() => store.openModal()}>Publish</Button>
                            <Button variant="text" sx={styles.sxOverride} style={styles.standardButton} disableRipple onClick={handleDelete}>Delete</Button>
                        </Box>
                        <Box sx={{ marginRight: '20%', backgroundColor: '#DDDDDD', borderRadius: '20px', minWidth: '870px', maxWidth: '870px' }}>
                            <Button variant="text" sx={styles.sxOverride} style={sidebar === 'map' ? styles.bigButtonSelected : styles.bigButton} disableRipple onClick={() => {setSidebar('map'); store.setMapData(map);}}>Map Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={sidebar === 'subdivision' ? styles.bigButtonSelected : styles.bigButton} disableRipple onClick={() => setSidebar('subdivision')}>Subdivision Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={sidebar === 'point' ? styles.bigButtonSelected : styles.bigButton} disableRipple onClick={() => {setSidebar('point'); setCurrentPoint(null)}}>Point Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={sidebar === 'bin' ? styles.bigButtonSelected : styles.bigButton} disableRipple onClick={() => setSidebar('bin')}>Bin Info</Button>
                            <Button variant="text" sx={styles.sxOverride} style={sidebar === 'gradient' ? styles.bigButtonSelected : styles.bigButton} disableRipple onClick={() => setSidebar('gradient')}>Gradient Info</Button>
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
                            await store.saveMapSchema(mapid, store.getSchema(mapid));
                            alert('Map saved');
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
                {sidebar === 'map' && <MapSidebar mapData={map} mapSchema={data}/>}
                {sidebar === 'subdivision' && <SubdivisionSidebar mapData={map} currentFeature={feature} mapSchema={data}/>}
                {sidebar === 'point' && <PointSidebar mapData={map} currentPoint={currentPoint} mapSchema={data} setMapEditMode={setMapEditMode} setCurrentPoint={setCurrentPoint}/>}
                {sidebar === 'bin' && <BinSidebar />}
                {sidebar === 'gradient' && <GradientSidebar />}
                {sidebar === 'template' && <TemplateSidebar onTemplateSelect={handleTemplateSelect} />}
                {sidebar === 'heatmap' && <HeatMapSidebar mapSchema={data} onHeatMapChange={handleHeatMapChange}/>}
            </Drawer>
            <ConfirmModal map={map}/>
        </Box>
    );
}
