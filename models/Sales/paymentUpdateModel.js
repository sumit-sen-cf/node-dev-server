const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const salesBookingPayment = new Schema({
    payment_update_id: {
        type: Number,
        required: false
    },
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
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
    sale_booking_date: {
        type: Date,
        required: false
    },
    sales_executive_name: {
        type: String,
        required: false
    },
    account_name: {
        type: String,
        required: false
    },
    gst_status: {
        type: String,
        required: false
    },
    campaign_amount: {
        type: Number,
        required: false
    },
    campaign_amount_without_gst: {
        type: Number,
        required: false
    },
    creation_date: {
        type: Date,
        required: false
    }

}, {
    timestamps: true
});

salesBookingPayment.pre('save', async function (next) {
    if (!this.payment_update_id) {
        const lastPaymentData = await this.constructor.findOne({}, {}, { sort: { 'payment_update_id': -1 } });

        if (lastPaymentData && lastPaymentData.payment_update_id) {
            this.payment_update_id = lastPaymentData.payment_update_id + 1;
        } else {
            this.payment_update_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model('salesPaymentUpdateModel', salesBookingPayment);