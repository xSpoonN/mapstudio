const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },
	passwordHash: { type: String, required: true },
	pfp: { type: String }, // file path
	bio: { type: String, default: '' },
	maps: [{ type: ObjectId, ref: 'Map' }],
	posts: [{ type: ObjectId, ref: 'Post' }],
	joinDate: { type: Date, default: Date.now },
	likedMaps: [{ type: ObjectId, ref: 'Map' }],
	dislikedMaps: [{ type: ObjectId, ref: 'Map' }],
	likedComments: [{ type: ObjectId, ref: 'Comment' }],
	dislikedComments: [{ type: ObjectId, ref: 'Comment' }],
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Date }
},
	{ timestamps: true },
)

module.exports = mongoose.model('User', userSchema);