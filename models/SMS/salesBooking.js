const mongoose = require('mongoose');

const salesBooking = new mongoose.Schema({
    sale_booking_id: {
        type: Number,//auto increment
        required: false,
    },
    customer_id: {
        type: Number,
        required: false,
    },
    sale_booking_date: {
        type: Date,
        default: Date.now,
    },
    campaign_amount: {
        type: Number,
        required: false,
    },
    base_amount: {
        type: Number,
        required: false,
    },
    gst_amount: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    credit_approval_status: {
        type: String,
        enum: ['manager_pending', 'manager_approved', 'manager_rejected', 'admin_pending',
            'admin_approved', 'admin_rejected', 'self_credit_used'],//0-6
    },
    reason_credit_approval: {
        type: String,
        required: false,
    },
    balance_payment_ondate: {
        type: Date,
        required: false,
    },
    gst_status: {
        type: Boolean,//0=non GST, 1= GST applicable
        required: false,
    },
    tds_status: {
        type: String,
        enum: ['open', 'close', 'tds_verified']//0-2
    },
    Booking_close_date: {
        type: Date,
        required: false,
    },
    tds_verified_amount: {
        type: Number,
        required: false,
    },
    tds_verified_remark: {
        type: String,
        required: false,
    },
    plan_file: {
        type: String,
        required: false,
    },
    booking_remarks: {
        type: String,
        required: false,
    },
    incentive_status: {
        type: String,
        enum: ['incentive', 'no-incentive', 'sharing'],//0-2
    },
    payment_credit_status: {
        type: String,
        enum: ['sent_for_payment_approval', 'sent_for_credit_approval'],//0-1
    },
    booking_status: {
        type: Number,//refers to the sales booking status model
        required: false,
        default: 0
    },
    incentive_sharing_user_id: {
        type: Number,
        required: false,
    },
    incentive_sharing_percent: {
        type: Number,
        required: false,
    },
    bad_debt: {
        type: Boolean,
        required: false,
    },
    bad_debt_reason: {
        type: String,
        required: false,
    },
    no_badge_achivement: {
        type: Boolean,
        required: false,
    },
    old_sale_booking_id: {
        type: Number,      //0=Normal booking, old_sale_booking_id > 0 =renewd booking
        required: false,
    },
    sale_booking_type: {
        type: String,
        enum: ['normal_booking', 'renewed_booking'],   //0=normal booking, 1=renewed_booking
    },
    service_taken_amount: {
        type: Number,
        required: false,
    },
    get_incentive_status: {
        type: Boolean,        //f=no incentive, t=incentive-applicable
        required: false,
    },
    incentive_amount: {
        type: Number,
        required: false,
        default: 0
    },
    earned_incentive_amount: {
        type: Number,
        required: false,
        default: 0
    },
    unearned_incentive_amount: {
        type: Number,
        required: false,
        default: 0
    },
    payment_type: {
        type: String,
        enum: ['partial', 'full'],
    },
    created_by: {
        type: Number,
        required: false,
    },
    managed_by: {
        type: Number,
        required: false,
    },
    last_updated_by: {
        type: Number,
        required: false,
    },
}, {
    timestamps: true
});

salesBooking.pre('save', async function (next) {
    if (!this.sale_booking_id) {
        const salesBookingData = await this.constructor.findOne({}, {}, { sort: { 'sale_booking_id': -1 } });

        if (salesBookingData && salesBookingData.sale_booking_id) {
            this.sale_booking_id = salesBookingData.sale_booking_id + 1;
        } else {
            this.sale_booking_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model('salesBooking', salesBooking);