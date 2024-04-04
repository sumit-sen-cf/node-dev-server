const mongoose = require('mongoose');

const phpVendorPaymentRequestModel = new mongoose.Schema({
    request_id: {
        type: Number,
        required: true
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
        type: String,
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
        type: String,
        // default: Date.now
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
    },
    tds_deduction: {
        type: Number,
        required: false,
        default: 0
    },
    gst_hold: {
        type: Number,
        required: false,
        default: 0
    },
    gst_Hold_Bool: {
        type: Boolean,
        required: false,
        default: 0
    },
    tds_Deduction_Bool: {
        type: Boolean,
        required: false,
        default: 0
    },
    zoho_status: {
        type: String,
        dafault: "Pending",
    },
    zoho_date: {
        type: Date
    },
    zoho_remark: {
        type: String,
        dafault: ""
    },
    tds_status: {
        type: String,
        dafault: "Pending",
    },
    tds_date: {
        type: Date
    },
    tds_remark: {
        type: String,
        dafault: ""
    },
    gst_status: {
        type: String,
        dafault: "Pending",
    },
    gst_date: {
        type: Date
    },
    gst_remark: {
        type: String,
        dafault: ""
    },
    gst_hold_amount: {
        type: Number,
        required: false,
        default: 0
    },
    is_email_send: {
        type: Boolean,
        required: false,
        default: "false"
    }
});

module.exports = mongoose.model('phpVendorPaymentRequestModel', phpVendorPaymentRequestModel);