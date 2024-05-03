const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesBookingPayment = new Schema({
    payment_date: {
        type: String,
    },
    sale_booking_id: {
        type: Number,
        required: false,
    },
    customer_id: {
        type: Number,
        required: false,
    },
    payment_amount: {
        type: Number,
        required: false
    },
    payment_mode: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "salespaymentmodes"
    },
    payment_detail_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "paymentDeatils"
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
    managed_by: {
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
}, {
    timestamps: true
});
module.exports = mongoose.model('salesBookingPayment', salesBookingPayment);