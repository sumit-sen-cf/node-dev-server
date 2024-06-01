const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesBookingPayment = new Schema({
    payment_date: {
        type: String,
    },
    sale_booking_id: {
        type: Number,
        required: false,
        ref: "salesBookingModel"
    },
    account_id: {
        type: Number,
        required: false,
        ref: "accountMasterModel"
    },
    payment_amount: {
        type: Number,
        required: false
    },
    payment_mode: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "salesPaymentModeModel"
    },
    payment_detail_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "salesPaymentDeatilsModel"
    },
    payment_screenshot: {
        type: String,
        required: false
    },
    payment_ref_no: {
        type: Number,
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
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('salesPaymentUpdateModel', salesBookingPayment);