const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');

const phpIncentiveModel = new mongoose.Schema({
    incentive_request_id: {
        type: Number,
        required: false
    },
    sales_executive_id: {
        type: Number,
        required: false
    },
    request_amount: {
        type: Number,
        required: false
    },
    finance_status: {
        type: Number,
        required: false
    },
    account_number: {
        type: Number,
        required: false
    },
    payment_ref_no: {
        type: String,
        required: false
    },
    remarks: {
        type: String,
        required: false
    },
    creation_date: {
        type: String,
        required: false
    },
    last_updated_date: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    sno: {
        type: Number,
        required: false
    },
    requested_amount: {
        type: Number,
        required: false,
        default: 0
    },
    payment_type: {
        type: Number,
        required: false,
        default: ""
    },
    reason: {
        type: String,
        required: false,
        default: ""
    },
    requested_date: {
        type: String,
        required: false,
        default: ""
    },
    paid_amount: {
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = mongoose.model('phpIncentiveModel', phpIncentiveModel);