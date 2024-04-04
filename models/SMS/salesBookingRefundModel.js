const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesBookingRefund = new Schema({
    sale_booking_id: {
        type: Number,
        required: false,
    },
    refund_amount: {
        type: Number,
        required: false
    },
    refund_files: {
        type: String,
        required: false
    },
    manager_refund_status: {
        type: String,
        enum: ['manager_pending', 'manager_approved', 'manager_rejected', 'admin_pending',
            'admin_approved', 'admin_rejected'],                                                     //0-6
    },
    manager_refund_date: {
        type: String,
        required: false
    },
    finance_refund_status: {
        type: String,
        enum: ["finance_pending", "payment_done", "payment_rejected"],                       //0-2
    },
    finance_refund_date: {
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
},
    { timestamps: true },
);
module.exports = mongoose.model('salesBookingRefund', salesBookingRefund);