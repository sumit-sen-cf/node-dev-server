const { required } = require("joi");
const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const planMakingPrimaryModel = new mongoose.Schema({
    plan_name: {
        type: String,
        required: true,
        default: ''
    },
    total_cost: {
        type: Number,
        required: false,
        default: 0
    },
    post_per_page: {
        type: Number,
        required: false,
        default: 0
    },
    story_per_page: {
        type: Number,
        required: false,
        default: 0
    },
    followers: {
        type: Number,
        required: false,
        default: 0
    },
    saved_date: {
        type: Date,
        default: Date.now,
    },
    saved_by: {
        type: Number,
        required: false,
    },
    plan_status:{
        type: String,
        required: true,
        enum: ['Draft','Saved'],
        default: 'Draft'
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

module.exports = mongoose.model("planMakingPrimaryModel", planMakingPrimaryModel);