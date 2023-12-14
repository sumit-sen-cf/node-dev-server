const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');
// const AutoIncrement = require('mongoose-auto-increment');

const instaSModel = new mongoose.Schema({
    mediaCont:{
        type: Number,
        required: false,
        default: 0
    },    
    expiredAt: {
        type: Date,
        required: false,
        default: Date.now
    },
    savedOn: {
        type: Date,
        required: false,
        default: Date.now
    },
    shortcode: {
        type: String,
        required: false,
        default: ""
    },
    creatorName: {
        type: String,
        required: false,
        default: ""
    },
    links: {
        type: Array,
        required: false,
        default: []
    },
    hashtags: {
        type: Array,
        required: false,
        default: []
    },
    mentions: {
        type: Array,
        required: false,
        default: []
    },
    locations: {
        type: Array,
        required: false,
        default: []
    },
    music:{
        type: Array,
        required: false,
        default: []
    },
    posttype_decision:{
        type: Number,
        required: false,
        default: 0
    },
    selector_name:{
        type: Number,
        required: false,
        default: 0
    },
    interpretor_name:{
        type: Number,
        required: false,
        default: 0
    },
    brand_id:{
        type: Number,
        required: false,
        default: 0
    },
    campaign_id:{
        type: Number,
        required: false,
        default: 0
    },
    auditor_name:{
        type: Number,
        required: false,
        default: 0
    },
    auditor_decision:{
        type: Number,
        required: false,
        default: 0
    },
    interpretor_decision:{
        type: Number,
        required: false,
        default: 0
    },
    selector_decision:{
        type: Number,
        required: false,
        default: 0
    },
    selector_date:{
        type: Date,
        required: false,
        default: ""
    },
    interpretor_date:{
        type: Date,
        required: false,
        default: ""
    },
    auditor_date:{
        type: Date,
        required: false,
        default: ""
    },
    image_url: {
        type: String,
        required: false,
        default: ""
    },
});

module.exports = mongoose.model('instaSModel', instaSModel);
