const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const reasonCreditApproval = new Schema({
    reason: {
        type: String,
        required: false
    },
    day_count: {
        type: Number,
        required: false
    },
    reason_order: {
        type: Number,
        required: false
    },
    reason_type: {
        type: String,
        enum: ["fixed", "own_reason"], //0=fixed,1=own reason
        required: false
    },
    created_by: {
        type: Number,
        required: false,
        default: 0,
    },
    updated_by: {
        type: Number,
        required: false,
        default: 0
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
},
    { timestamps: true },
);
module.exports = mongoose.model('saleReasonCreditApprovalModel', reasonCreditApproval);