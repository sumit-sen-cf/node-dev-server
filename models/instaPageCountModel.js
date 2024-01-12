const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');
// const AutoIncrement = require('mongoose-auto-increment');

const instaPageCountModel = new mongoose.Schema({
    id:{
      type: Number,
      required: false
    },
    ip_id:{
        type: Number,
        required: true,
        default: 0
    },
    last_updated_at:{
        type: Date,
        default: Date.now
    },
    last_updated_by:{
        type: Number,
        required: false,
        default: 0
    },
    post_count:{
        type: Number,
        required: false,
        default: 0
    },
    followers:{
        type: Number,
        required: false,
        default: 0
    },
    days_reach:{
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = mongoose.model('instaPageCountModel', instaPageCountModel);