const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const planMakingSecModel = new mongoose.Schema({
    plan_making_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    p_id: {
        type: Number,
        required: true,
        default: 0
    },
    page_name: {
        type: String,
        required: false,
        default: ''
    },
    page_link: {
        type: String,
        required: false,
        default: ''
    },
    status: {
        type: String,
        required: false,
        default: ''
    },
    cost_per_post: {
        type: Number,
        required: false,
        default: 0
    },
    cost_per_story: {
        type: Number,
        required: false,
        default: 0
    },
    both_cost: {
        type: Number,
        required: false,
        default: 0
    }
});

// planMakingPrimaryModel.pre('save', async function (next) {
//     if (!this.asset_request_id) {
//         const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'asset_request_id': -1 } });

//         if (lastAgency && lastAgency.asset_request_id) {
//             this.asset_request_id = lastAgency.asset_request_id + 1;
//         } else {
//             this.asset_request_id = 1;
//         }
//     }
//     next();
// });

module.exports = mongoose.model("planMakingSecModel", planMakingSecModel);