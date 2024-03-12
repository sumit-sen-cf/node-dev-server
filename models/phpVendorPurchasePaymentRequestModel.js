const mongoose = require('mongoose');

const phpVendorPurchasePaymentRequestModel = new mongoose.Schema({
    request_id: {
        type: String,
        required: true,
        unique: true
    },
    vendor_name: {
        type: String,
        required: false,
    },
    vendor_id: {
        type: String,
        required: false,
        default: ""
    },
    request_by: {
        type: String,
        required: false,
        default: ""
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
    remark_audit: {
        type: String,
        required: false
    },
    outstandings: {
        type: String,
        required: false,
        default: ""
    },
    priority: {
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
    request_amount: {
        type: String,
        required: false,
        default: ""
    },
    base_amount: {
        type: String,
        required: false,
        default: ""
    },
    gst_amount: {
        type: String,
        required: false,
        default: ""
    },
    status: {
        type: String,
        required: false,
        default: ""
    },
    mob1: {
        type: String,
        required: false,
        default: ""
    },
    address: {
        type: String,
        required: false,
        default: ""
    },
    pan: {
        type: String,
        required: false,
        default: ""
    },
    gst: {
        type: String,
        required: false,
        default: ""
    },
    payment_details: {
        type: String,
        required: false,
        default: ""
    },
    pan_img: {
        type: String,
        required: false,
        default: ""
    },
    invc_img: {
        type: String,
        required: false,
        default: ""
    },
    payment_cycle: {
        type: String,
        required: false,
        default: ""
    },
    gst_hold: {
        type: String,
        required: false,
        default: ""
    },
    tds_deduction: {
        type: String,
        required: false,
        default: ""
    },
    gst_hold: {
        type: String,
        required: false,
        default: ""
    },
    TDSDeduction: {
        type: String,
        required: false,
        default: ""
    },
    gst_hold_amount: {
        type: String,
        required: false,
        default: ""
    },
    page_name: {
        type: String,
        required: false,
        default: ""
    }
});

module.exports = mongoose.model('phpVendorPurchasePaymentRequestModel', phpVendorPurchasePaymentRequestModel);