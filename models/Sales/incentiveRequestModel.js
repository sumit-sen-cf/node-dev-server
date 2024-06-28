const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const salesIncentiveRequest = new Schema({
    sales_executive_id: {
        type: Number,
        required: true
    },
    user_requested_amount: {
        type: Number,
        required: true
    },
    admin_approved_amount: {
        type: Number,
        required: false
    },
    admin_status: {
        type: String,
        required: false,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    admin_action_reason: {
        type: String,
        required: false
    },
    account_number: { //finance uploded
        type: Number,
        required: false
    },
    payment_ref_no: { //finance uploded
        type: Number,
        required: false
    },
    payment_date: { //finance uploded
        type: Date,
        required: false
    },
    payment_type: { //finance uploded
        type: String,
        required: false,
        enum: ["full", "partial"],
    },
    partial_payment_reason: { //finance uploded
        type: String,
        required: false
    },
    remarks: { //finance uploded
        type: String,
        required: false,
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

module.exports = mongoose.model('salesIncentiveRequestModel', salesIncentiveRequest);