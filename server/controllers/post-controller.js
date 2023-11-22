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

module.exports = {
    createPost,
    getPosts
}