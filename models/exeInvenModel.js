const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');
// const AutoIncrement = require('mongoose-auto-increment');

const exeInvenModel = new mongoose.Schema({
    // creator_id:{
    //     type: Number,
    //     required: true
    // },
    account_link: {
        type: String,
        required: false,
        default: ""
    },
    account_name: {
        type: String,
        required: false,
        default: ""
    },
    api_service_id: {
        type: String,
        required: false,
        default: ""
    },
    both_: {
        type: Number,
        required: false,
        default: 0
    },
    brand_Integration:{
        type: String,
        required: false,
        default: ""
    },
    cat_name:{
        type: String,
        required: false,
        default: ""
    },
    channel_link:{
        type: String,
        required: false,
        default: ""
    },
    channel_username:{
        type: String,
        required: false,
        default: ""
    },
    comment:{
        type: Number,
        required: false,
        default: 0
    },
    commission:{
        type: String,
        required: false,
        default: ""
    },
    Created_at:{
        type: Date,
        default: Date.now
    },
    display:{
        type: Number,
        required: false,
        default: 0
    },
    follower_count: {
        type: Number,
        required: false,
        default: 0
    },
    group_id:{
        type: String,
        required: false,
        default: ""
    },
    hidden_:{
        type: Number,
        required: false,
        default: 0
    },
    incoming_status:{
        type: String,
        required: false,
        default: ""
    },
    logo_Integration: {
        type: String,
        required: false,
        default: ""
    },
    multiple_cost:{
        type: String,
        required: false,
        default: ""
    },
    note:{
        type: Number,
        required: false,
        default: 0
    },
    otherboth: {
        type: Number,
        required: false,
        default: 0
    },
    otherpost:{
        type: Number,
        required: false,
        default: 0
    },
    otherstory: {
        type: Number,
        required: false,
        default: 0
    },
    p_id:{
        type: Number,
        required: false,
        default: 0
    },
    page_category: {
        type: Number,
        required: false,
        default: 0
    },
    page_health:{
        type: String,
        required: false,
        default: ""
    },
    page_level: {
        type: String,
        required: false,
        default: ""
    },
    page_likes: {
        type: Number,
        required: false,
        default: 0
    },
    page_link: {
        type: String,
        required: false,
        default: ""
    },
    page_name: {
        type: String,
        required: false,
        default: ""
    },
    page_status: {
        type: String,
        required: false,
        default: ""
    },
    page_user_id: {
        type: String,
        required: false,
        default: ""
    },
    platform: {
        type: String,
        required: false,
        default: ""
    },
    platform_old: {
        type: Number,
        required: false,
        default: 0
    },
    post: {
        type: Number,
        required: false,
        default: 0
    },
    price_type: {
        type: String,
        required: false,
        default: ""
    },
    repost: {
        type: Number,
        required: false,
        default: 0
    },
    sales_both_: {
        type: Number,
        required: false,
        default: 0
    },
    sales_post: {
        type: Number,
        required: false,
        default: 0
    },
    sales_story: {
        type: Number,
        required: false,
        default: 0
    },
    service_id: {
        type: Number,
        required: false,
        default: 0
    },
    service_name: {
        type: String,
        required: false,
        default: ""
    },
    shorts: {
        type: Number,
        required: false,
        default: 0
    },
    story: {
        type: Number,
        required: false,
        default: 0
    },
    subscribers: {
        type: Number,
        required: false,
        default: 0
    },
    username: {
        type: String,
        required: false,
        default: ""
    },
    vendor_id: {
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = mongoose.model('exeInvenModel', exeInvenModel);
