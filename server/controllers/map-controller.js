
const Map = require('../models/Map')

const { DefaultAzureCredential } = require('@azure/identity');
const { BlobServiceClient } = require("@azure/storage-blob");
const { create } = require('domain');
const { get } = require('http');

const blobServiceClient = new BlobServiceClient(`https://mapstudio.blob.core.windows.net`, new DefaultAzureCredential() );

//create a new map  "models/Map.js"
createMap = async (req, res) => {
    try {
        const { title, description, author, comments, likes, dislikes, mapFile } = req.body;
        const newMap = new Map({ title, description, author, comments, likes, dislikes, mapFile });
        await newMap.save();
        res.status(201).json(newMap);

    } catch (err) {
        res.status(400).json({ error: 'Failed to create a map.' });
        
    }

}

deleteMapById = async (req, res) => {
    try {
        const map = await Map.findByIdAndDelete(req.params.id);
        if (!map) {
            return res.status(404).json({ error: 'Map not found.' });
        }
        res.status(200).json(map);
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete the map.' });
    }
}

getMapById = async (req, res) => {
    try {
        const map = await Map.findById(req.params.id);
        if (!map) {
            return res.status(404).json({ error: 'Map not found.' });
        }
        res.status(200).json(map);
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch the map.' });
    }
}

updateMapInfoById = async (req, res) => {

    try {
        const map = await Map.findById(req.params.id);
        if (!map) {
            return res.status(404).json({ error: 'Map not found.' });
        }
        const { title, description, author, comments, likes, dislikes, mapFile } = req.body;
        map.title = title;
        map.description = description;
        map.author = author;
        map.comments = comments;
        map.likes = likes;
        map.dislikes = dislikes;
        map.mapFile = mapFile;
        await map.save();
        res.status(200).json(map);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update the map.' });
    }
}



updateMapFile = async (req, res) => {
    try {
        const map = await Map.findById(req.params.id);
        if (!map) {
            return res.status(404).json({ error: 'Map not found.' });
        }
        map.mapFile = req.body.mapFile;
        await map.save();
        res.status(200).json(map);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update the map.' });
    }
}
