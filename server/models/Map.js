const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const mapSchema = new mongoose.Schema({
    author: { type: ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, required: true, default: false },
    title: { type: String, required: true, default: 'My Map' },
    description: { type: String, default: '' },
    likes: { type: Number, required: true, default: 0 },
    dislikes: { type: Number, required: true, default: 0 },
    likeUsers: [{ type: String, required: true, default: [] }],
    dislikeUsers: [{ type: String, required: true, default: [] }],
    comments: [{ type: ObjectId, ref: 'Comment', required: true, default: [] }],
    mapFile: { type: Buffer, default: null },
    creationDate: { type: Date, required: true, default: Date.now },
    updateDate: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Map', mapSchema);