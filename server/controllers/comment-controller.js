const Comment = require('../models/Comment')
const DiscussionPost = require('../models/DiscussionPost')
const User = require('../models/User');

createComment = (req, res) => {
    const body = req.body;
    body.authorId = req.userId;
    console.log("createComment body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Comment',
        })
    } else if (body.content === '') {
        return res.status(400).json({
            success: false,
            error: 'Blank',
        })
    } 

    const comment = new Comment(body);
    User.findOne({ _id: req.userId })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    errorMessage: 'User not found'
                });
            }
            console.log("User found: " + JSON.stringify(user));
        })
        .then(() => comment.save())
        .then(() => {
            DiscussionPost.findOne({ _id: req.params.id })
                .then(post => {
                    post.comments.push(comment._id)
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
        })
        .catch(error => {
            console.error(error);
            return res.status(400).json({
                errorMessage: 'Comment Not Created!'
            });
        });
}

getComments = async (req, res) => {
    const body = req.body
    Comment.find({ _id: { $in: body.ids } })
        .then(comments => {
            console.log(body.ids)
            return res.status(200).json({ success: true, comments:comments })
        })
        .catch(error => {
            console.error(error);
            return res.status(400).json({
                errorMessage: 'Could not get comments'
            });
        });
}

updateComment = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Comment.findOne({ _id: req.params.id })
        .then(comment => {
            comment.likes = body.comment.likes
            comment.dislikes = body.comment.dislikes
            comment.likeUsers = body.comment.likeUsers
            comment.dislikeUsers = body.comment.dislikeUsers
            comment.save().then(() => {
                console.log("comment updated");
                return res.status(200).json({
                    success: true,
                    comment: comment,
                    message: 'comment updated!'
                })
            })
                .catch(error => {
                    console.log("FAILURE: " + JSON.stringify(error));
                    return res.status(404).json({
                        error,
                        message: 'comment not updated!',
                    })
                })
        })
}

module.exports = {
    createComment,
    getComments,
    updateComment
}

