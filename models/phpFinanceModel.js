const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');

const phpFinanceModel = new mongoose.Schema({
    payment_update_id: {
        type: Number,
        required: false
    },
    payment_date: {
        type: String,
        required: false
    },
    sale_booking_id: {
        type: Number,
        required: false
    },
    payment_amount: {
        type: Number,
        required: false
    },
    payment_amount_show: {
        type: String,
        required: false
    },
    payment_mode: {
        type: String,
        required: false
    },
    payment_detail_id: {
        type: Number,
        required: false
    },
    payment_screenshot: {
        type: String,
        required: false
    },
    payment_type: {
        type: String,
        required: false
    },
    payment_ref_no: {
        type: String,
        required: false
    },
    credit_limit_check: {
        type: Number,
        required: false
    },
    user_credit_limit_check: {
        type: Number,
        required: false
    },
    payment_approval_status: {
        type: Number,
        required: false
    },
    reason_credit_approval: {
        type: String,
        required: false
    },
    balance_payment_ondate: {
        type: String,
        required: false
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
        required: false
    },
    last_updated_by: {
        type: Number,
        required: false
    },
    creation_date: {
        type: Date,
        required: false
    },
    last_updated_date: {
        type: String,
        required: false
    },
    cust_id: {
        type: Number,
        required: false
    },
    sale_booking_date: {
        type: Date,
        required: false
    },
    campaign_amount: {
        type: Number,
        required: false
    },
    base_amount: {
        type: Number,
        required: false
    },
    gst_amount: {
        type: Number,
        required: false
    },
    net_amount: {
        type: Number,
        required: false
    },
    campaign_amount_without_gst: {
        type: Number,
        required: false
    },
    total_paid_amount: {
        type: Number,
        required: false
    },
    balance: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    status_desc: {
        type: String,
        required: false
    },
    invoice_creation_status: {
        type: Number,
        required: false
    },
    invoice: {
        type: String,
        required: false
    },
    invoice_particular: {
        type: String,
        required: false
    },
    invoice_action_reason: {
        type: String,
        required: false
    },
    manager_approval: {
        type: Number,
        required: false
    },
    salesexe_credit_approval: {
        type: Number,
        required: false
    },
    salesexe_credit_used: {
        type: Number,
        required: false
    },
    execution_approval: {
        type: Number,
        required: false
    },
    last_action_reason: {
        type: String,
        required: false
    },
    execution_date: {
        type: String,
        required: false
    },
    execution_remark: {
        type: String,
        required: false
    },
    execution_done_by: {
        type: Number,
        required: false
    },
    execution_status: {
        type: String,
        required: false
    },
    execution_summary: {
        type: String,
        required: false
    },
    fixed_credit_approval_reason: {
        type: String,
        required: false
    },
    gst_status: {
        type: Number,
        required: false
    },
    tds_status: {
        type: Number,
        required: false
    },
    close_date: {
        type: String,
        required: false
    },
    verified_amount: {
        type: Number,
        required: false
    },
    verified_remark: {
        type: String,
        required: false
    },
    sale_booking_file: {
        type: String,
        required: false
    },
    no_incentive: {
        type: Number,
        required: false
    },
    old_sale_booking_id: {
        type: Number,
        required: false
    },
    sale_booking_type: {
        type: String,
        required: false
    },
    rs_sale_booking_id: {
        type: Number,
        required: false
    },
    service_taken_amount: {
        type: Number,
        required: false
    },
    user_id: {
        type: Number,
        required: false
    },
    cust_type: {
        type: String,
        required: false
    },
    cust_name: {
        type: String,
        required: false
    },
    mobile_no: {
        type: Number,
        required: false
    },
    alternative_no: {
        type: Number,
        required: false
    },
    email_id: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    instagram_username: {
        type: String,
        required: false
    },
    lead_source_id: {
        type: Number,
        required: false
    },
    new_type: {
        type: String,
        required: false
    },
    sales_category_id: {
        type: Number,
        required: false
    },
    sales_sub_category_id: {
        type: Number,
        required: false
    },
    company_name: {
        type: String,
        required: false
    },
    gst_no: {
        type: String,
        required: false
    },
    pancard_no: {
        type: String,
        required: false
    },
    contact_person_name: {
        type: String,
        required: false
    },
    gst_doc: {
        type: String,
        required: false
    },
    pancard_doc: {
        type: String,
        required: false
    },
    other_doc: {
        type: String,
        required: false
    },
    other_doc_name: {
        type: String,
        required: false
    },
    id: {
        type: Number,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    detail: {
        type: String,
        required: false
    },
    gst_bank: {
        type: String,
        required: false
    },
    status: {
        type: Number,
        required: false
    },
    created_at: {
        type: Date,
        required: false
    },
    sno: {
        type: Number,
        required: false
    },
    user_name: {
        type: String,
        required: false
    },
    payment_update_remarks: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('phpFinanceModel', phpFinanceModel);