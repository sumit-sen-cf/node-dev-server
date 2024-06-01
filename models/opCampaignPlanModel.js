const { default: mongoose } = require("mongoose");

const opCampaignPlanModel = new mongoose.Schema({
    planName: {
        type: String,
        required: true
    },
    p_id: {
        type: String,
        required: true
    },
    postPerPage: {
        type: String,
        required: true
    },
    postRemaining: {
        type: String,
        default: ""
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
    storyRemaining: {
        type: Number,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt: {
        type: Date
    },
    modifiedBy: {
        type: String,
        default: "user"
    },
    replacement_status: {
        type: String
    },
    replaced_by: {
        type: String,
        default: 'N/A'
    },
    replaced_with: {
        type: String,
        default: 'N/A',
    },
    // replacement_id: {
    //     type: String,
    // },
    isExecuted: {
        type: Boolean,
        default: false,
    }

});

module.exports = mongoose.model(
    "opCampaignPlanModel",
    opCampaignPlanModel
);
