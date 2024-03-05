const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');

const phpPaymentRefundModel = new mongoose.Schema({
    sale_booking_id: {
        type: Number,
        required: false
    },
    sale_booking_refund_id: {
        type: Number,
        required: false
    },
    refund_amount: {
        type: Number,
        required: false
    },
    refund_files: {
        type: String,
        required: false
    },
    refund_request_reason: {
        type: String,
        required: false
    },
    manager_refund_status: {
        type: Number,
        required: false
    },
    manager_refund_reason: {
        type: String,
        required: false
    },
    finance_refund_status: {
        type: Number,
        required: false
    },
    finance_refund_reason: {
        type: String,
        required: false
    },
    creation_date: {
        type: Date,
        required: false
    },
    last_updated_date: {
        type: Date,
        required: false
    },
    cust_id: {
        type: Number,
        required: false
    },
    campaign_amount: {
        type: Number,
        required: false
    },
    sale_booking_date: {
        type: Date,
        required: false
    },
    cust_name: {
        type: String,
        required: false
    },
    sno: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('phpPaymentRefundModel', phpPaymentRefundModel);