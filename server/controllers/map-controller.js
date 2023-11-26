
const Map = require('../models/Map')
const User = require('../models/User');

createMap = (req, res) => {
    console.log(req);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Post',
        })
    } else if (body.title === '' || body.content === '') {
        return res.status(400).json({
            success: false,
            error: 'Blank',
        })
    } 

    const post = new Map(body);
    console.log("post: " + post.toString());
    if (!post) {
        return res.status(400).json({ success: false, error: err })
    }

    return;
    User.findOne({ _id: req.userId })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    errorMessage: 'User not found'
                }); 
            }
            console.log("User found: " + JSON.stringify(user));
            user.posts.push(post._id);
            return user.save();
        })
        .then(() => post.save())
        .then(() => {
            return res.status(201).json({
                post: post
            });
        })
        .catch(error => {
            console.error(error);
            return res.status(400).json({
                errorMessage: 'Post Not Created!'
            });
        });
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
        console.log('Finding map with id ' + req.params.id);
        const map = await Map.findById(req.params.id);
        if (!map) {
            return res.status(404).json({ error: 'Map not found.' });
        }
        res.status(200).json({ success: true, map: map });
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
        const { title, description, author, comments, likes, dislikes, mapFile, likeUsers, dislikeUsers } = req.body.map;
        map.title = title;
        map.description = description;
        map.author = author;
        map.comments = comments;
        map.likes = likes;
        map.dislikes = dislikes;
        map.mapFile = mapFile;
        map.likeUsers = likeUsers;
        map.dislikeUsers = dislikeUsers;
        await map.save();
        return res.status(200).json({
            success: true,
            map: map,
            message: 'Map updated!'
        })
    } catch (err) {
        console.log(err);
        res.status(404);
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

module.exports = {
    createMap,
    deleteMapById,
    getMapById,
    updateMapInfoById,
    updateMapFile
}