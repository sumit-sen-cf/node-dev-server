const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const caseStudyModel = new mongoose.Schema({
    account_id: {
        type: Number,
        required: false,
    },
    no_of_posts: {
        type: Number,
        required: false,
        default: 0
    },
    reach: {
        type: Number,
        required: false,
        default: 0
    },
    impression: {
        type: Number,
        required: false,
        default: 0
    },
    views: {
        type: Number,
        required: false,
        default: 0
    },
    engagement: {
        type: Number,
        required: false,
        default: 0
    },
    story_views: {
        type: Number,
        required: false,
        default: 0
    },
    link_clicks: {
        type: Number,
        required: false,
        default: 0
    },
    likes: {
        type: Number,
        required: false,
        default: 0
    },
    comments: {
        type: Number,
        required: false,
        default: 0
    },
    cf_google_sheet_link: {
        type: String,
        required: false,
        default: ""
    },
    sarcasm_google_sheet__link: {
        type: String,
        required: false,
        default: ""
    },
    MMC_google_sheet__link: {
        type: String,
        required: false,
        default: ""
    },
    creation_date: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: Number,
        required: false,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        default: 0
    },
    last_updated_date: {
        type: Date,
        default: 0
    }
});

module.exports = mongoose.model("caseStudyModel", caseStudyModel);
