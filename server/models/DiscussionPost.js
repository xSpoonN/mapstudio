const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const discussionPostSchema = new mongoose.Schema({
    author: { type: String, required: true },
    authorId: { type: ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
  	content: { type: String, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    comments: [{ type: ObjectId, ref: 'Comment' }],
    publishedDate: { type: Date, required: true, default: Date.now  }
});

module.exports = mongoose.model('DiscussionPost', discussionPostSchema);