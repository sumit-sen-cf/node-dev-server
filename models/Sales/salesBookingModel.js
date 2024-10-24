const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Break Circular Dependency require this place.
const { updateSharedIncentiveSBCollection } = require("../../helper/circularDependency");

const salesBooking = new mongoose.Schema({
    sale_booking_id: {
        type: Number,//auto increment
        required: false,
    },
    account_id: {
        type: Number,
        required: false,
        ref: "accountMasterModel"
    },
    is_draft_save: {
        type: Boolean,
        required: true,
        default: false,
    },
    sale_booking_date: {
        type: Date,
        default: Date.now,
    },
    campaign_amount: {
        type: Number,
        required: false,
        default: 0
    },
    campaign_name: {
        type: String,
        required: false,
    },
    campaign_id: {
        type: Schema.Types.ObjectId,
        required: false,
    },
    approved_amount: {
        type: Number,
        required: false,
        default: 0
    },
    requested_amount: {
        type: Number,
        required: false,
        default: 0
    },
    record_service_amount: {
        type: Number,
        required: false,
        default: 0
    },
    record_service_counts: {
        type: Number,
        required: false,
        default: 0
    },
    is_execution_token_show: {
        type: Boolean,
        required: false,
        default: false
    },
    brand_id: {
        type: Schema.Types.ObjectId,
        required: false,
    },
    base_amount: {
        type: Number,
        required: false,
        default: 0
    },
    gst_amount: {
        type: Number,
        required: false,
        default: 0
    },
    description: {
        type: String,
        required: false,
    },
    credit_approval_status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'self_credit_used'],
        // enum: ['manager_pending', 'manager_approved', 'manager_rejected', 'admin_pending',
        //     'admin_approved', 'admin_rejected', 'self_credit_used'],//0-6
    },
    credit_approval_by: {
        type: Number,
        required: false,
    },
    reason_credit_approval: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    reason_credit_approval_own_reason: {
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
        enum: ['open', 'close', 'tds_verified'],//0-2
        default: 'open'
    },
    Booking_close_date: {
        type: Date,
        required: false,
    },
    tds_percentage: {
        type: Number,
        required: false,
        default: 0
    },
    tds_amount: {
        type: Number,
        required: false,
        default: 0
    },
    tds_verified_amount: {
        type: Number,
        required: false,
        default: 0
    },
    tds_verified_remark: {
        type: String,
        required: false,
    },
    record_service_file: {
        type: String,
        required: false,
    },
    plan_link: {
        type: String,
        required: false,
    },
    booking_remarks: {
        type: String,
        required: false,
    },
    incentive_request_id: {
        type: Schema.Types.ObjectId,
        required: false,
    },
    incentive_request_status: { //on incentive release request time add
        type: String,
        enum: ['pending', 'requested', 'released'],
        required: false,
    },
    settlement_sale_booking_id: { //only add in Non GST booking
        type: Number,
        required: false,
    },
    incentive_status: {
        type: String,
        enum: ['incentive', 'no-incentive', 'sharing'],//0-2
    },
    incentive_earning_status: {
        type: String,
        enum: ['earned', 'un-earned'],
        default: 'un-earned'
    },
    payment_credit_status: {
        type: String,
        required: true,
        enum: ['sent_for_payment_approval', 'sent_for_credit_approval', 'self_credit_used'],//0-1
    },
    booking_status: {
        type: String,  //refers to the sales booking status model
        required: false,
        // ref: "salesBookingStatus"
    },
    is_incentive_sharing: {
        type: Boolean,
        required: false,
        default: false,
    },
    incentive_sharing_percent: {
        type: Number,
        required: false,
        default: 0,
    },
    incentive_sharing_users_array: {
        type: Array,
        required: false,
    },
    bad_debt: {
        type: Boolean,
        required: false,
        default: false,
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
        default: 'normal_booking'
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
    // final_invoice: {
    //     type: String,
    //     required: false,
    // },
    invoice_request_status: {
        type: String,
        enum: ['pending', 'requested', 'uploaded'],
    },
    invoice_requested_amount: {
        type: Number,
        required: false,
    },
    created_by: {
        type: Number,
        required: false,
    },
    updated_by: {
        type: Number,
        required: false,
    },
}, {
    timestamps: true
});

// Pre save hook for perform action before save data
salesBooking.pre('save', async function (next) {
    if (!this.sale_booking_id) {
        const salesBookingData = await this.constructor.findOne({}, {}, { sort: { 'sale_booking_id': -1 } });

        if (salesBookingData && salesBookingData.sale_booking_id) {
            this.sale_booking_id = salesBookingData.sale_booking_id + 1;
        } else {
            this.sale_booking_id = 2000;
        }
    }

    //if the gst_status is true then invoice request default "pending" set.
    if (this.isNew && this.gst_status === true && !this.invoice_request_status) {
        this.invoice_request_status = 'pending';
        this.invoice_requested_amount = 0;
    }
    next();
});

// Post update hook for perform action after updating data
salesBooking.post('updateOne', async function (doc, next) {
    try {
        var _this = this;
        var where = _this._conditions;
        var fields = _this._update;
        //Update fields in shared sale booking collection.
        await updateSharedIncentiveSBCollection(where, fields);
        next();
    } catch (error) {
        console.log('Error in Sale booking Model Post updateOne hook', error);
    }
});

// Post update hook for perform action after updating data
salesBooking.post('findOneAndUpdate', async function (doc, next) {
    try {
        var _this = this;
        var where = _this._conditions;
        var fields = _this._update;
        //Update fields in shared sale booking collection.
        await updateSharedIncentiveSBCollection(where, fields);
        next();
    } catch (error) {
        console.log('Error in Sale booking Model Post findOneAndUpdate hook', error);
    }
});

module.exports = mongoose.model('salesBookingModel', salesBooking);