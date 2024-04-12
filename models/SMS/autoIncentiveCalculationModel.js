const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const autoIncentiveCalculation = new Schema({
    month_year: {
        type: String,
        required: false,
    },
    sales_executive_id: {
        type: Number,
        required: false
    },
    campaign_amount: {
        type: Number,
        required: false
    },
    paid_amount: {
        type: Number,
        required: false
    },
    incentive_amount: {
        type: Number,
        required: false
    },
    earned_incentive: {
        type: Number,
        required: false
    },
    unearned_incentive: {
        type: Number,
        required: false
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
},
    { timestamps: true },
);
module.exports = mongoose.model('autoIncentiveCalculation', autoIncentiveCalculation);