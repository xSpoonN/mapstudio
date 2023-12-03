const mongoose = require('mongoose');
module.exports = mongoose.model('MapSchema', new mongoose.Schema({}, {strict: false}), 'mapschemas');
