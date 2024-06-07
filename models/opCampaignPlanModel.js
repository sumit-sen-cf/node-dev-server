const { default: mongoose } = require("mongoose");

const opCampaignPlanModel = new mongoose.Schema({
    // planId: {
    //     type: Number,
    //     unique: true,
    // },
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
        default: 1,
    },
    postRemaining: {
        type: Number,
        default: 0
    },
    storyPerPage: {
        type: Number,
        default: 1,
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "opcampaignmodels"
    },
    storyRemaining: {
        type: Number,
        default: 0
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


// opCampaignPlanModel.pre('save', async function (next) {
//     if (!this.plan_id) {
//         const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'plan_id': -1 } });

//         if (lastAgency && lastAgency.plan_id) {
//             this.plan_id = lastAgency.plan_id + 1;
//         } else {
//             this.plan_id = 1;
//         }
//     }
//     next();
// });

module.exports = mongoose.model(
    "opCampaignPlanModel",
    opCampaignPlanModel
);
