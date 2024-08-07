const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const userHistoryModel = new mongoose.Schema({
    user_id: {
        type: Number,
        required: false
    },
    user_designation: {
        type: Number,
        required: false
    },
    user_email_id: {
        type: String,
        required: false
    },
    user_login_id: {
        type: String,
        required: false
    },
    user_login_password: {
        type: String,
        required: false,
        default: ""
    },
    user_name: {
        type: String,
        required: false,
        unique: false,
        default: ""
    },
    user_contact_no: {
        type: Number,
        required: false
    },
    dept_id: {
        type: Number,
        required: false,
        default: 0
    },
    role_id: {
        type: Number,
        required: false,
        default: 0
    },
    job_type: {
        type: String,
        required: false,
        default: ""
    },
    PersonalNumber: {
        type: Number,
        required: false,
        unique: false,
        default: 0
    },
    Report_L1: {
        type: Number,
        required: false,
        default: 0
    },
    PersonalEmail: {
        type: String,
        required: false,
        unique: false,
        default: ""
    },
    joining_date: {
        type: Date,
        required: false
    },
    releaving_date: {
        type: Date,
        // default: Date.now
    },
    salary: {
        type: Number,
        required: false,
        default: 0
    },
    DOB: {
        type: Date,
        required: false
    },
    Age: {
        type: Number,
        required: false,
        default: 0
    },
    MartialStatus: {
        type: String,
        required: false,
        default: ""
    },
    tds_applicable: {
        type: String,
        required: false,
        default: ""
    },
    tds_per: {
        type: Number,
        required: false,
        default: 0
    },
    user_status: {
        type: String,
        required: false
    },
    sub_dept_id: {
        type: Number,
        required: false,
        default: 0
    },
    pan_no: {
        type: String,
        required: false,
        default: ""
    },
    uid_no: {
        type: String,
        required: false,
        default: ""
    },
    current_address: {
        type: String,
        required: false,
        default: ""
    },
    current_city: {
        type: String,
        required: false,
        default: ""
    },
    current_state: {
        type: String,
        required: false,
        default: ""
    },
    current_pin_code: {
        type: Number,
        required: false,
        default: null
    },
    permanent_address: {
        type: String,
        required: false,
        default: ""
    },
    permanent_city: {
        type: String,
        required: false,
        default: ""
    },
    permanent_state: {
        type: String,
        required: false,
        default: ""
    },
    permanent_pin_code: {
        type: Number,
        required: false,
        default: null
    },
    invoice_template_no: {
        type: Number,
        required: false,
        default: 0
    },
    image: {
        type: String,
        required: false,
        default: ""
    },
    digital_signature_image: {
        type: String,
        required: false,
        default: ""
    },
    bank_name: {
        type: String,
        required: false,
        default: ""
    },
    account_type: {
        type: String,
        required: false,
        default: ""
    },
    branch_name: {
        type: String,
        required: false,
        default: ""
    },
    ifsc_code: {
        type: String,
        required: false,
        default: ""
    },
    account_no: {
        type: String,
        required: false,
        default: ""
    },
    ctc: {
        type: Number,
        required: false,
        default: 0
    },
    nick_name: {
        type: String,
        required: false,
        default: ""
    },
    beneficiary: {
        type: String,
        required: false,
        default: ""
    },
    emp_id: {
        type: String,
        required: false,
        default: ""
    },
    alternate_contact: {
        type: Number,
        required: false,
        default: null
    },
    cast_type: {
        type: String,
        required: false,
        default: ""
    },
    emergency_contact_person_name2: { //This is use for check the user's salary in PF,PF&ESIC,Inhand
        type: String,
        required: false,
        default: ""
    },
    att_status: {
        type: String
    },
    year_salary: {
        type: Number,
        required: false,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('userHistoryModel', userHistoryModel);