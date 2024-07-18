const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constant = require("../../common/constant");

const salesBookingInvoiceRequest = new Schema({
    sale_booking_id: {
        type: Number,
        required: true,
    },
    invoice_type_id: {
        type: String,
        enum: ['proforma', 'tax-invoice'],
        required: false
    },
    invoice_particular_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "salesinvoiceparticularmodels"
    },
    purchase_order_number: {
        type: Number,
        required: false,
    },
    purchase_order_upload: {
        type: String,
        required: false
    },
    invoice_file: { //finance uploded
        type: String,
        required: false,
    },
    invoice_number: { //finance uploded
        type: Number,
        required: false,
    },
    // invoice_date: { //finance uploded
    //     type: Date,
    //     required: false,
    // },
    party_name: { //finance uploded
        type: String,
        required: false,
    },
    invoice_uploaded_date: {  //finance uploded
        type: Date,
        required: false,
    },
    invoice_creation_status: {
        type: String,
        enum: ["pending", "rejected", "uploaded"],
        default: "pending"
    },
    invoice_action_reason: {
        type: String,
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
module.exports = mongoose.model('salesInvoiceRequestModel', salesBookingInvoiceRequest);