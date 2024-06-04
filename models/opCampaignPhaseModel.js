const { default: mongoose } = require("mongoose");

const opCampaignPhaseModel = new mongoose.Schema({
    phaseName: {
        type: String,
        required: true
    },
    p_id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default:""
    },
    postRemaining: {
        type: String,
        default: ""
    },
    storyRemaining: {
        type: Number,
        default: ""
    },
    postPerPage: {
        type: Number,
        required: true
    },
    storyPerPage: {
        type: Number,
        required: true
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "opcampaignmodels"
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "opcampaignplanmodels"
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: Number,
        default: null
    },
    modifiedAt: {
        type: Date
    },
    modifiedBy: {
        type: Number,
        default: null
    },
    replacement_status: {
        type: String
    },
    replaced_with: {
        type: String,
        default: 'N/A',
    },
    replaced_by: {
        type: String,
        default: 'N/A'
    },
    isExecuted: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model("opCampaignPhaseModel", opCampaignPhaseModel);