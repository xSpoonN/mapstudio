const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const comment = new mongoose.Schema({
    author: { type: String, required: true },
    authorId: { type: ObjectId, ref: 'User', required: true },
  	content: { type: String, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    likeUsers: [{ type: String }],
	dislikeUsers: [{ type: String }],
    publishedDate: { type: Date, required: true, default: Date.now  }
});

module.exports = mongoose.model('Comment', comment);