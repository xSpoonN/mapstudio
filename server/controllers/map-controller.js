const Map = require('../models/Map')
const MapSchema = require('../models/MapSchema')
const User = require('../models/User');
const Comment = require('../models/Comment');
const { DefaultAzureCredential } = require('@azure/identity');
const { BlobServiceClient } = require("@azure/storage-blob");

const blobServiceClient = new BlobServiceClient(`https://mapstudio.blob.core.windows.net`, new DefaultAzureCredential() );
const Ajv = require('ajv');
const ajv = new Ajv();
const mongoose = require('mongoose');
/* const mapSchemaModel = mongoose.model('MapSchema', new mongoose.Schema({}, {strict: false}), 'mapschemas'); */


createMap = async (req, res) => {
    console.log(req);

    const author = await User.findOne({ _id: req.body.author });

    const map = new Map({
        author: author,
        title: req.body.title,
        description: req.body.description
    });
    if (!map) {
        return res.status(400).json({ success: false, error: err })
    }

    map.save().then(() => {
        author.maps.push(map._id);
        author.save();
        return res.status(201).json({
            success: true,
            id: map._id,
            message: 'Map created!',
        })
    }).catch(error => {
        console.log(error);
        return res.status(400).json({
            error,
            message: 'Map not created!',
        })
    });
}

deleteMapById = async (req, res) => {
    try {
        const map = await Map.findOneAndDelete({ _id: req.params.id });

        if (!map) {
            return res.status(404).json({ error: 'Map not found.' });
        }
        
        // attempt to delete MapSchema
        if (map.mapSchema) {
            await MapSchema.deleteOne({ _id: map.mapSchema });
        }

        // drop all associated comments
        const commentIds = map.comments;
        if (commentIds && commentIds.length > 0) {
            await Comment.deleteMany({ _id: { $in: commentIds } });
        }

        // Delete map from author's maps array
        // Find author by getting map's author id
        const authorId = map.author;
        const author = await User.findOne({ _id: authorId });

        author.maps.pull(map._id);
        await author.save();
        await deleteFromBlobStorage(map._id);

        return res.status(200).json({
            success: true,
            id: map._id,
            message: 'Map deleted!',
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error,
            message: 'Map not deleted!',
        });
    }
};

getMapById = async (req, res) => {
    Map.findOne({ _id: req.params.id })
        .then(map => {
            if (!map) {
                return res.status(404).json({ error: 'Map not found.' });
            }
            return res.status(200).json({
                success: true,
                map: map,
                message: 'Map retrieved!',
            })
        }).catch(error => {
            console.log("FAILURE: " + JSON.stringify(error));
            return res.status(404).json({
                error,
                message: 'Map not found',
            })
        })
}

updateMapInfoById = async (req, res) => {
    Map.findOne({ _id: req.params.id })
        .then(map => {
            if (!map) {
                return res.status(404).json({ error: 'Map not found.' });
            }
            const { title, author, description, comments, likes, dislikes, likeUsers, dislikeUsers, isPublished, publishedDate } = req.body.map;
            map.title = title;
            map.author = author;
            map.description = description;
            map.comments = comments;
            map.likes = likes;
            map.dislikes = dislikes;
            map.likeUsers = likeUsers;
            map.dislikeUsers = dislikeUsers;
            map.isPublished = isPublished;
            map.publishedDate = publishedDate;
            map.updateDate = Date.now();
            map.save().then(() => {
                return res.status(200).json({
                    success: true,
                    map: map,
                    message: 'Map updated!',
                })
            }).catch(error => {
                console.log(error);
                return res.status(400).json({
                    error,
                    message: 'Map not updated!',
                })
            })
        }).catch(error => {
            console.log(error);
            return res.status(400).json({
                error,
                message: 'Map not found!',
            })
        })

}

async function uploadToBlobStorage(geoJsonData, mapid) {
    try {
        const containerClient = blobServiceClient.getContainerClient('mapfiles');
        const blockBlobClient = containerClient.getBlockBlobClient(`geojson${mapid}.json`);
        const jsonContent = JSON.stringify(geoJsonData);
        const uploadBlobResponse = await blockBlobClient.upload(jsonContent, jsonContent.length);
        console.log(`upload response: ${uploadBlobResponse.requestId}`);
        const url = `https://mapstudio.blob.core.windows.net/mapfiles/geojson${mapid}.json`;
        return url; // return the url of the blob
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

async function deleteFromBlobStorage(mapid) {
    try {
        const containerClient = blobServiceClient.getContainerClient('mapfiles');
        const blockBlobClient = containerClient.getBlockBlobClient(`geojson${mapid}.json`);
        const deleteBlobResponse = await blockBlobClient.deleteIfExists();
        console.log(`delete response: ${deleteBlobResponse.requestId}`);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

updateMapFileById = async (req, res) => {
    // req includes map id and geojson data
    // upload geojson data to blob storage and get the url of the blob
    // update the mapFile field of the map with the url

    const geojsonData = req.body.geojsonData;
    const blobUrl = await uploadToBlobStorage(geojsonData, req.params.id);
    if (!blobUrl) {
        return res.status(400).json({
            error,
            message: 'Map not updated!',
        })
    }

    Map.findOne({ _id: req.params.id })
        .then(map => {
            if (!map) {
                return res.status(404).json({ error: 'Map not found.' });
            }
            map.mapFile = blobUrl;
            map.save().then(() => {
                return res.status(200).json({
                    success: true,
                    id: map._id,
                    message: 'Map File updated!',
                })
            }).catch(error => {
                console.log(error);
                return res.status(400).json({
                    error,
                    message: 'Map not updated!',
                })
            })
        }).catch(error => {
            console.log(error);
            return res.status(400).json({
                error,
                message: 'Map not found!',
            })
        })
}

getMapsByUser = async (req, res) => {
    if(req.userId === req.params.id) {
        Map.find({ author: req.params.id })
        .then(maps => {
            maps.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
            return res.status(200).json({
                success: true,
                maps: maps,
                message: 'Maps retrieved!'
            })
        }).catch(error => {
            console.log("FAILURE: " + JSON.stringify(error));
            return res.status(404).json({
                error,
                message: 'Maps not found',
            })
        })
    } else {
        Map.find({ author: req.params.id, isPublished: true })
        .then(maps => {
            maps.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
            return res.status(200).json({
                success: true,
                maps: maps,
                message: 'Maps retrieved!'
            })
        }).catch(error => {
            console.log("FAILURE: " + JSON.stringify(error));
            return res.status(404).json({
                error,
                message: 'Maps not found',
            })
        })
    }   
}

getPublishedMaps = async (req, res) => {
    Map.find({ isPublished: true })
        .then(async maps => {
            console.log('Published maps:', maps);
            const authorIds = maps.map(map => map.author);
            const authors = await Promise.all(authorIds.map(authorId =>
                User.findOne({ _id: authorId })
            ));
            return res.status(200).json({
                success: true,
                maps: maps,
                authors: authors,
                message: 'Maps retrieved!'
            })
        }).catch(error => {
            console.log("FAILURE: " + JSON.stringify(error));
            return res.status(404).json({
                error,
                message: 'Maps not found',
            })
        })
}

getLandingMaps = async (req, res) => {
    try {
        let yourMaps = []
        if(req.params.id !== "null") {
            const user = await User.findOne({ _id: req.params.id });
            if (user) {
                yourMaps = await Map.find({ author: user._id, isPublished: false })
                    .sort({ updateDate: 'desc' })
                    .limit(4);
            }
        }

        let popularMaps = await Map.find({ isPublished: true })
            .sort({ likes: 'desc' })
            .limit(4);

        let authorIds = popularMaps.map(map => map.author);
        const popularMapsAuthors = await Promise.all(authorIds.map(authorId =>
            User.findOne({ _id: authorId })
        ));

        let newMaps = await Map.find({ isPublished: true })
            .sort({ publishedDate: 'desc' })
            .limit(4);

        authorIds = newMaps.map(map => map.author);
        const newMapsAuthors = await Promise.all(authorIds.map(authorId =>
            User.findOne({ _id: authorId })
        ));

        res.status(200).json({
            success: true,
            yourMaps: yourMaps,
            popularMaps: popularMaps,
            popularMapsAuthors: popularMapsAuthors,
            newMaps: newMaps,
            newMapsAuthors: newMapsAuthors
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
}

updateMapSchema = async (req, res) => {
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
          "showSatellite": {
            "type": "boolean",
            "default": false
          }
        },
        "required": [ "type" ]
    }
    const mapSchema = req.body.schema;
    console.log(mapSchema);
    const validate = ajv.compile(SCHEMA);
    if (!validate(mapSchema)) {
        return console.log(validate.errors);
        return res.status(400).json({
            error: validate.errors,
            message: 'Invalid schema',
        })
    }
    console.log("here");
    const map = await Map.findOne({ _id: req.params.id })
    if (!map) {
        return res.status(400).json({
            error: 'Map not found',
            message: 'Map not found',
        })
    }
    if (!map.mapSchema) {
        try {
            const newdoc = await MapSchema.create(mapSchema);
            console.log(newdoc);
            map.mapSchema = newdoc._id;
            await map.save();
            return res.status(200).json({
                success: true,
                id: newdoc._id,
                message: 'Schema updated!',
            })
        } catch (err) {
            console.log("error1241241");
            return res.status(400).json({
                error: err,
                message: 'Schema not updated!',
            })
        }
    }
    try {
        const existingMap = await MapSchema.findOne({ _id: map.mapSchema });
        if (!existingMap) {
            console.log("error2");
            return res.status(400).json({
                error: "Schema not found!",
                message: 'Schema not updated!',
            });
        }
        const updatedMap = await MapSchema.replaceOne({ _id: map.mapSchema }, mapSchema);
        console.log(updatedMap);
        return res.status(200).json({
            success: true,
            id: updatedMap._id,
            message: 'Schema updated!',
        });
    } catch (error) {
        console.log("error3");
        return res.status(400).json({
            error: error.message,
            message: 'Schema not updated!',
        });
    }
}

getMapSchema = async (req, res) => {
    try {
        const doc = await MapSchema.findOne({_id: req.params.id });
        return res.status(200).json({
            success: true,
            schema: doc,
            message: 'Schema retrieved!',
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
            message: 'Schema not found!',
        })
    }
}

module.exports = {
    createMap,
    deleteMapById,
    getMapById,
    updateMapInfoById,
    updateMapFileById,
    getMapsByUser,
    getPublishedMaps,
    getLandingMaps,
    updateMapSchema,
    getMapSchema
}