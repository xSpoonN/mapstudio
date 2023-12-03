const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const mapSchema = new mongoose.Schema({
    author: { type: ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false },
    title: { type: String, required: true, default: 'My Map' },
    description: { type: String, default: '' },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likeUsers: [{ type: String, default: [] }],
    dislikeUsers: [{ type: String, default: [] }],
    comments: [{ type: ObjectId, ref: 'Comment', default: [] }],
    mapFile: { type: String, default: '' },
    creationDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
    publishedDate: { type: Date, default: null }
});

module.exports = mongoose.model('Map', mapSchema);