const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');
// const AutoIncrement = require('mongoose-auto-increment');

const exeSumModel = new mongoose.Schema({
    // creator_id:{
    //     type: Number,
    //     required: true
    // },
    id: {
        type: Number,
        required: false,
        unique: true,
    },
    sale_booking_execution_id: {
        type: String,
        required: false,
        default: ""
    },
    sale_booking_id: {
        type: String,
        required: false,
        default: ""
    },
    start_date: {
        type: String,
        default: ""
    },
    end_date: {
        type: String,
        default: ""
    },
    summary: {
        type: String,
        required: false,
        default: ""
    },
    remarks: {
        type: String,
        required: false,
        default: ""
    },
    created_by: {
        type: String,
        required: false,
        default: ""
    },
    last_updated_by: {
        type: String,
        required: false,
        default: ""
    },
    creation_date: {
        type: String,
        default: ""
    },
    last_updated_date: {
        type: String,
        default: ""
    },
    sale_booking_date: {
        type: String,
        default: ""
    },
    campaign_amount: {
        type: String,
        required: false,
        default: ""
    },
    execution_date: {
        type: String,
        default: ""
    },
    execution_remark: {
        type: String,
        required: false,
        default: ""
    },
    execution_done_by: {
        type: String,
        required: false,
        default: ""
    },
    cust_name: {
        type: String,
        required: false,
        default: ""
    },
    loggedin_user_id: {
        type: Number,
        required: false,
        default: 0
    },
    execution_status: {
        type: Number,
        required: false,
        default: 0
    },
    payment_update_id: {
        type: Number,
        required: false,
        default: 0
    },
    payment_type: {
        type: String,
        required: false,
        default: ""
    },
    status_desc: {
        type: String,
        required: false,
        default: ""
    },
    invoice_creation_status: {
        type: String,
        required: false,
        default: ""
    },
    manager_approval: {
        type: String,
        required: false,
        default: ""
    },
    invoice_particular: {
        type: String,
        required: false,
        default: ""
    },
    payment_status_show: {
        type: String,
        required: false,
        default: ""
    },
    sales_executive_name: {
        type: String,
        required: false,
        default: ""
    },
    page_ids: {
        type: String,
        required: false,
        default: ""
    },
    service_id: {
        type: String,
        required: false,
        default: ""
    },
    service_name: {
        type: String,
        required: false,
        default: ""
    },
    execution_excel: {
        type: String,
        default: ""
    },
    total_paid_amount: {
        type: Number,
        default: 0
    },
    credit_approval_amount: {
        type: Number,
        default: 0
    },
    credit_approval_date: {
        type: String,
        default: ""
    },
    credit_approval_by: {
        type: String,
        default: ""
    },
    campaign_amount_without_gst: {
        type: Number,
        default: 0
    },
    execution_time: {
        type: String,
        default: ""
    },
    execution_date_time: {
        type: String,
        default: ""
    },
    execution_sent_date: {
        type: String,
        default: ""
    },
    execution_pause: {
        type: String,
        default: ""
    },
    customer_created_date: {
        type: String,
        default: ""
    },
    gst_status: {
        type: String,
        default: ""
    },
    booking_created_date: {
        type: String,
        default: ""
    },
    booking_last_updated_date: {
        type: String,
        default: ""
    },
    record_service_amount: {
        type: String,
        default: ""
    },
    record_service_created_date: {
        type: String,
        default: ""
    },
    last_payment_date: {
        type: String,
        default: ""
    },
    manager_name: {
        type: String,
        default: ""
    },
    start_date: {
        type: Date,
        default: ""
    },
    execution_token: {
        type: String,
        required: false
    },
    brand_name: {
        type: String,
        required: false
    },
    record_service_campaign_name: {
        type: String,
        required: false
    },
});

exeSumModel.pre('save', async function (next) {
    if (!this.id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });

        if (lastAgency && lastAgency.id) {
            this.id = lastAgency.id + 1;
        } else {
            this.id = 1;
        }
    }
    next();
});

module.exports = mongoose.model('exeSumModel', exeSumModel);
