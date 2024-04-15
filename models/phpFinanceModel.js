const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');

const phpFinanceModel = new mongoose.Schema({
    payment_update_id: {
        type: String,
        required: false
    },
    sale_booking_id: {
        type: String,
        required: false
    },
    payment_date: {
        type: String,
        required: false
    },
    payment_amount_show: {
        type: String,
        required: false
    },
    payment_mode: {
        type: String,
        required: false
    },
    payment_screenshot: {
        type: String,
        required: false
    },
    payment_ref_no: {
        type: String,
        required: false
    },
    payment_approval_status: {
        type: String,
        required: false
    },
    creation_date: {
        type: String,
        required: false
    },
    sale_booking_date: {
        type: String,
        required: false
    },
    campaign_amount: {
        type: String,
        required: false
    },
    gst_status: {
        type: String,
        required: false
    },
    campaign_amount_without_gst: {
        type: String,
        required: false
    },
    user_id: {
        type: String,
        required: false
    },
    cust_name: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    detail: {
        type: String,
        required: false
    },
    sno: {
        type: Number,
        required: false
    },
    user_name: {
        type: String,
        required: false
    },
    payment_update_remarks: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('phpFinanceModel', phpFinanceModel);