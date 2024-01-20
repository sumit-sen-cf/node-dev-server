const mongoose = require('mongoose');

const phpVendorPaymentRequestModel = new mongoose.Schema({
    request_id: {
        type: Number,
        required: true,
        unique: true
    },
    vendor_id: {
        type: Number,
        required: false,
        default: 0
    },
    request_date: {
        type: String
    },
    request_by: {
        type: Number,
        required: false,
        default: 0
    },
    name: {
        type: String,
        required: false,
    },
    vendor_name: {
        type: String,
        required: false,
    },
    request_amount: {
        type: Number,
        required: false,
        default: 0
    },
    priority: {
        type: String,
        required: false
    },
    status: {
        type: Number,
        required: false,
        default: 0
    },
    evidence: {
        type: String,
        required: false
    },
    payment_date: {
        type: Date,
        // default: Date.now
    },
    payment_mode: {
        type: String,
        required: false
    },
    payment_amount: {
        type: Number,
        required: false,
        default: 0
    },
    payment_by: {
        type: Number,
        required: false,
        default: 0
    },
    remark_finance: {
        type: String,
        required: false
    },
    invc_no: {
        type: String,
        required: false,
    },
    invc_Date: {
        type: Date,
        default: Date.now
    },
    invc_remark: {
        type: String,
        required: false
    },
    remark_audit: {
        type: String,
        required: false
    },
    outstandings: {
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = mongoose.model('phpVendorPaymentRequestModel', phpVendorPaymentRequestModel);