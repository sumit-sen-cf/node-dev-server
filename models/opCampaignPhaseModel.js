const { default: mongoose } = require("mongoose");

const opCampaignPhaseModel = new mongoose.Schema({
    // phaseId: {
    //     type: Number,
    //     unique: true
    // },
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
        default: ""
    },
    postRemaining: {
        type: Number,
        default: 0
    },
    storyRemaining: {
        type: Number,
        default: 0
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
        type: Number,
        required: false
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


// opCampaignPhaseModel.pre('save', async function (next) {
//     if (!this.phaseId) {
//         const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'phaseId': -1 } });

//         if (lastAgency && lastAgency.phaseId) {
//             this.phaseId = lastAgency.phaseId + 1;
//         } else {
//             this.phaseId = 1;
//         }
//     }
//     next();
// });

module.exports = mongoose.model("opCampaignPhaseModel", opCampaignPhaseModel);