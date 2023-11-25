const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const mapSchema = new mongoose.Schema({
    author: { type: ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    likeUsers: [{ type: String }],
    dislikeUsers: [{ type: String }],
    comments: [{ type: ObjectId, ref: 'Comment' }],
    mapFile: { type: Buffer },
    creationDate: { type: Date, required: true, default: Date.now },
    updateDate: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Map', mapSchema);