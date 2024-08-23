const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const salesBookingPayment = new Schema({
    payment_date: {
        type: Date,
        required: false,
    },
    sale_booking_id: {
        type: Number,
        required: true,
        ref: "salesBookingModel"
    },
    account_id: {
        type: Number,
        required: false,
        ref: "accountMasterModel"
    },
    payment_amount: {
        type: Number,
        required: true
    },
    payment_mode: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "salesPaymentModeModel"
    },
    payment_detail_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "salesPaymentDetailsModel"
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
        enum: ['pending', 'approval', 'reject'],
        default: "pending"
    },
    action_reason: {
        type: String,
        required: false
    },
    remarks: {
        type: String,
        required: false
    },
    created_by: {
        type: Number,
        required: true,
    },
    updated_by: {
        type: Number,
        required: false,
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('salesPaymentUpdateModel', salesBookingPayment);