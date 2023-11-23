const DiscussionPost = require('../models/DiscussionPost')
const User = require('../models/User');

createPost = (req, res) => {
    const body = req.body;
    body.authorId = req.userId;
    console.log("createPost body: " + JSON.stringify(body));

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

    const post = new DiscussionPost(body);
    console.log("post: " + post.toString());
    if (!post) {
        return res.status(400).json({ success: false, error: err })
    }

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

getPosts = async (req, res) => {
    DiscussionPost.find()
        .then(posts => {
            return res.status(200).json({ success: true, posts:posts })
        })
        .catch(error => {
            console.error(error);
            return res.status(400).json({
                errorMessage: 'Could not get posts'
            });
        });
}

updatePost = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    DiscussionPost.findOne({ _id: req.params.id })
        .then(post => {
            post.likes = body.post.likes
            post.dislikes = body.post.dislikes
            post.comments = body.post.comments
            post.likeUsers = body.post.likeUsers
            post.dislikeUsers = body.post.dislikeUsers
            post.save().then(() => {
                console.log("Post updated");
                return res.status(200).json({
                    success: true,
                    post: post,
                    message: 'Post updated!'
                })
            })
                .catch(error => {
                    console.log("FAILURE: " + JSON.stringify(error));
                    return res.status(404).json({
                        error,
                        message: 'Post not updated!',
                    })
                })
        })
}

getPost = async (req, res) => {
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    DiscussionPost.findOne({ _id: req.params.id })
        .then(post => {
            console.log("Post updated");
                return res.status(200).json({
                    success: true,
                    post: post,
                    message: 'Post retrieved!'
                })
        }).catch(error => {
            console.log("FAILURE: " + JSON.stringify(error));
            return res.status(404).json({
                error,
                message: 'Post not retrieved!',
            })
        })
}

module.exports = {
    createPost,
    getPosts,
    updatePost,
    getPost
}