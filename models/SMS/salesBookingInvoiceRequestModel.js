const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesBookingInvoiceRequest = new Schema({
    sale_booking_id: {
        type: Number,
        required: false,
    },
    invoice_type_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "salesInvoiceType"
    },
    invoice_particular_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "salesInvoiceParticular"
    },
    invoice_file: {
        type: String,
        required: false,
    },
    po_number: {
        type: Number,
        required: false,
    },
    po_upload: {
        type: String,
        required: false
    },
    invoice_number: {
        type: Number,
        required: false,
    },
    invoice_date: {
        type: String,
        default: ""
    },
    party_name: {
        type: String,
        required: false,
    },
    invoice_requested_date: {
        type: Date,
        //  default: Date.now
    },

    invoice_uploaded_date: {
        type: Date,
        //  default: Date.now
    },

    invoice_creation_status: {
        type: String,
        enum: ["pending", "reject", "success"],
        default: "pending"
    },
    invoice_action_reason: {
        type: String,
        required: false
    },
    request_by: {
        type: Number,
        required: false
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    }
},
    { timestamps: true },
);
module.exports = mongoose.model('salesBookingInvoiceRequest', salesBookingInvoiceRequest);