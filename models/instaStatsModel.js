const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');
const AutoIncrement = require('mongoose-auto-increment');

const instaStatsModel = new mongoose.Schema({
    id:{
      type: Number,
      required: true
    },
    ip_id:{
        type: Number,
        required: false,
        default: 0
    }, 
    story_view:{
        type: Number,
        required: false,
        default: 0
    }, 
    month_reach :{
        type: Number,
        required: false,
        default: 0
    }, 
    impression :{
        type: Number,
        required: false,
        default: 0
    }, 
    profile_visit :{
        type: Number,
        required: false,
        default: 0
    }, 
    gender :{
        type: String,
        required: false,
        default: ""
    }, 
    link_tap :{
        type: Number,
        required: false,
        default: 0
    }, 
    email_tap :{
        type: Number,
        required: false,
        default: 0
    }, 
    content_shared :{
        type: Number,
        required: false,
        default: 0
    }, 
    followerss :{
        type: Number,
        required: false,
        default: 0
    }, 
    non_followerss :{
        type: Number,
        required: false,
        default: 0
    }, 
    likes :{
        type: Number,
        required: false,
        default: 0
    }, 
    shares:{
        type: Number,
        required: false,
        default: 0
    }, 
    saves :{
        type: Number,
        required: false,
        default: 0
    }, 
    month_ :{
        type: Number,
        required: false,
        default: 0
    }, 
    year_:{
        type: Number,
        required: false,
        default: 0
    }
});

AutoIncrement.initialize(mongoose.connection);
instaStatsModel.plugin(
    AutoIncrement.plugin, 
    { model: 'instaStatsModels', field: 'id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('instaStatsModel', instaStatsModel);