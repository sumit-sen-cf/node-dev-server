const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');
// const AutoIncrement = require('mongoose-auto-increment');

const instaPModel = new mongoose.Schema({
    // post_id:{
    //     type: Number,
    //     required: true
    // },
    postType:{
        type: String,
        required: false,
        default: ""
    },    
    creatorName: {
        type: String,
        required: false,
        default: ""
    },
    profile_pic_url: {
        type: String,
        required: false,
        default: ""
    },
    allComments: {
        type: Number,
        required: false,
        default: 0
    },
    brand_id: {
        type: Number,
        required: false,
        default: 0
    },
    todayComment: {
        type: Number,
        required: false,
        default: 0
    },
    pastComment: {
        type: Number,
        required: false,
        default: 0
    },
    allLike:{
        type: Number,
        required: false,
        default: 0
    },
    campaign_id:{
        type: Number,
        required: false,
        default: 0
    },
    todayLikes:{
        type: Number,
        required: false,
        default: 0
    },
    pastLike:{
        type: Number,
        required: false,
        default: 0
    },
    allView:{
        type: Number,
        required: false,
        default: 0
    },
    todayViews:{
        type: Number,
        required: false,
        default: 0
    },
    // agency_id:{
    //     type: Number,
    //     required: false,
    //     default: 0
    // },
    pastView:{
        type: Number,
        required: false,
        default: 0
    },
    title:{
        type: String,
        required: false,
        default: ""
    },
    postedOn:{
        type: String,
        required: false,
        default: ""
    },
    postUrl:{
        type: String,
        required: false,
        default: "",
        unique: true
    },
    postImage:{
        type: String,
        required: false,
        default: ""
    },
    shortCode:{
        type: String,
        required: false,
        default: ""
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
    dateCol: {
        type: Date,
        default: Date.now
    },
    hashTag: {
        type: String,
        required: false
    },
    handle: {
        type: String,
        required: false,
        default:""
    },
    mentions: {
        type: String,
        required: false
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
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    },
    music_info: {
        type: Object, 
        required: false,
        default: "" 
    },
    location: {
        type: Object,
        required: false,
        default: "" 
    },
    sponsored: {
        type: Boolean, 
        required: false,
        default: null
    },
    crone_trak: {   
        type: Number, 
        required: false,
        default: 0 // 1 mean tracked and 0 mean not tracked
    },
});

module.exports = mongoose.model('instaPModel', instaPModel);
