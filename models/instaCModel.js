const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');
// const AutoIncrement = require('mongoose-auto-increment');

const instaCModel = new mongoose.Schema({
    // creator_id:{
    //     type: Number,
    //     required: true
    // },
    groupName: {
        type: String,
        required: false,
        default: ""
    },
    creatorName: {
        type: String,
        required: false,
        default: ""
    },
    followersCount: {
        type: Number,
        required: false,
        default: 0
    },
    followersToday: {
        type: Number,
        required: false,
        default: 0
    },
    followersPast:{
        type: Number,
        required: false,
        default: 0
    },
    followingCount:{
        type: Number,
        required: false,
        default: 0
    },
    followingToday:{
        type: Number,
        required: false,
        default: 0
    },
    followingPast:{
        type: Number,
        required: false,
        default: 0
    },
    postCount:{
        type: Number,
        required: false,
        default: 0
    },
    postCountToday:{
        type: Number,
        required: false,
        default: 0
    },
    postCountPast:{
        type: Number,
        required: false,
        default: 0
    },
    dateCol: {
        type: Date,
        default: Date.now
    },
});

// AutoIncrement.initialize(mongoose.connection);
// instaCModel.plugin(
//     AutoIncrement.plugin, 
//     { model: 'instaCModels', field: 'creator_id', startAt: 1, incrementBy: 1 }
// );

module.exports = mongoose.model('instaCModel', instaCModel);
