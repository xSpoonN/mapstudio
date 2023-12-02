
const Map = require('../models/Map')
const User = require('../models/User');

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
    Map.findOne({ _id: req.params.id })
        .then(map => {
            if (!map) {
                return res.status(404).json({ error: 'Map not found.' });
            }
            // delete map from author's maps array
            // find author by getting map's author id
            let authorId = map.author;
            author = User.findOne({ _id: authorId });
            map.remove().then(() => {
                author.maps.pull(map._id);
                author.save();
                return res.status(200).json({
                    success: true,
                    id: map._id,
                    message: 'Map deleted!',
                })
            }).catch(error => {
                console.log(error);
                return res.status(400).json({
                    error,
                    message: 'Map not deleted!',
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
            map.title = req.body.title;
            map.description = req.body.description;
            map.isPublished = req.body.isPublished;
            map.updateDate = Date.now();
            map.save().then(() => {
                return res.status(200).json({
                    success: true,
                    id: map._id,
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


updateMapFileById = async (req, res) => {
    // update the map file's url

    Map.findOne({ _id: req.params.id })
        .then(map => {
            if (!map) {
                return res.status(404).json({ error: 'Map not found.' });
            }
            map.mapFile = req.body.mapFile;
            map.save().then(() => {
                return res.status(200).json({
                    success: true,
                    id: map._id,
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

getMapsByUser = async (req, res) => {
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

        authorIds = popularMaps.map(map => map.author);
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

module.exports = {
    createMap,
    deleteMapById,
    getMapById,
    updateMapInfoById,
    updateMapFileById,
    getMapsByUser,
    getPublishedMaps,
    getLandingMaps
}