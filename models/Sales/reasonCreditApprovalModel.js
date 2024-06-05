const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constant = require("../../common/constant");

const reasonCreditApproval = new Schema({
    reason: {
        type: String,
        required: false,
        trim: true
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
        enum: ["fixed", "own_reason"],   //0=fixed,1=own reason
        required: false
    },
    created_by: {
        type: Number,
        required: false,
    },
    updated_by: {
        type: Number,
        required: false,
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('salesReasonCreditApprovalModel', reasonCreditApproval);