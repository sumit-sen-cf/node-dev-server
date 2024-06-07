const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const opExecutionModel = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "opcampaignmodels"
    },
    phase_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "opcampaignphasemodels"
    },
    phaseName: {
        type: String,
        required: true,
    },
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "opcampaignplanmodels"
    },
    plan_name: {
        type: String,
        required: false
    },
    p_id: {
        type: String,
        required: false
    },
    postPerPage: {
        type: Number,
        default: 0
    },
    postRemaining: {
        type: Number,
        default: 0
    },
    storyPerPage: {
        type: Number,
        default: 0
    },
    storyRemaining: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        defaule: Date.now(),
    },
    updated_at: {
        type: Date,
    },
    ass_status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'executed', 'done']
    },
    executed_at: {
        type: Date
    },
    isExecuted: {
        type: Boolean,
        default: false,
    },
    post_link: {
        type: String,
        default: ''
    },
    post_date: {
        type: Date,
        default: null
    },
    post_type: {
        type: String,
        default: ''
    },
    post_like: {
        type: Number,
        default: 0
    },
    post_comment: {
        type: Number,
        default: 0
    },
    post_views: {
        type: Number,
        default: 0
    },
    post_captions: {
        type: String,
        default: ''
    },
    post_media: {
        type: String,
        default: ''
    },
    last_link_hit_date: {
        type: Date,
        default: null
    },
    story_link: {
        type: String,
        default: ''
    },
    story_date: {
        type: Date,
        default: null
    },
    story_like: {
        type: Number,
        default: 0
    },
    story_comment: {
        type: Number,
        default: 0
    },
    story_views: {
        type: Number,
        default: 0
    },
    story_captions: {
        type: String,
        default: ''
    },
    story_media: {
        type: String,
        default: ''
    },
    story_last_link_hit_date: {
        type: Date,
        default: null
    }

});

module.exports = mongoose.model("opExecutionModel", opExecutionModel);