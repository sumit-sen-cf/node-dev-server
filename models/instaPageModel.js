const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');
// const AutoIncrement = require('mongoose-auto-increment');

const instaPageModel = new mongoose.Schema({
    ip_regist_id:{
      type: Number,
      required: false
    },
    ip_type:{
        type: String,
        required: false,
        default: ""
    },
    platform:{
        type: String,
        required: false,
        default: ""
    },
    ip_name:{
        type: String,
        required: false,
        default: ""
    },
    password:{
        type: String,
        required: false,
        default: ""
    },
    backup_code:{
        type: String,
        required: false,
        default: ""
    },
    contact_no:{
        type: String,
        required: false,
        default: ""
    },
    email:{
        type: String,
        required: false,
        default: ""
    },
    email_pass:{
        type: String,
        required: false,
        default: ""
    },
    recovery_email:{
        type: String,
        required: false,
        default: ""
    },
    recovery_contact:{
        type: String,
        required: false,
        default: ""
    },
    allocated_to_primary:{
        type: Number,
        required: false,
        default: 0
    },
    created_by:{
        type: Number,
        required: false,
        default: 0
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    last_updated_by:{
        type: Number,
        required: false,
        default: 0
    },
    last_updated_at:{
        type: Date,
        default: Date.now
    },
    report_L1:{
        type: Number,
        required: false,
        default: 0
    },
    report_L2:{
        type: Number,
        required: false,
        default: 0
    },
    report_L3:{
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
    },
    user_id:{
        type: Number,
        required: false,
        default: 0
    },
    user_response:{
        type: String,
        required: false,
        default: ""
    }
});

module.exports = mongoose.model('instaPageModel', instaPageModel);