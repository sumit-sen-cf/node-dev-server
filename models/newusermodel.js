const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const userSecondModel = new mongoose.Schema({
    user_id: {
        type: Number,
        required: false
    },
    spouse_name: {
        type: String,
        required: false,
        default: ""
    },
    highest_qualification_name: {
        type: String,
        required: false,
        default: ""
    },
    tenth_marksheet_validate: {
        type: String,
        required: false,
        default: ""
    },
    twelveth_marksheet_validate: {
        type: String,
        required: false,
        default: ""
    },
    UG_Marksheet_validate: {
        type: String,
        required: false,
        default: ""
    },
    passport_validate: {
        type: String,
        required: false,
        default: ""
    },
    pre_off_letter_validate: {
        type: String,
        required: false,
        default: ""
    },
    pre_expe_letter_validate: {
        type: String,
        required: false,
        default: ""
    },
    pre_relieving_letter_validate: {
        type: String,
        required: false,
        default: ""
    },
    bankPassBook_Cheque_validate: {
        type: String,
        required: false,
        default: ""
    },
    tenth_marksheet_validate_remark: {
        type: String,
        required: false,
        default: ""
    },
    twelveth_marksheet_validate_remark: {
        type: String,
        required: false,
        default: ""
    },
    UG_Marksheet_validate_remark: {
        type: String,
        required: false,
        default: ""
    },
    passport_validate_remark: {
        type: String,
        required: false,
        default: ""
    },
    pre_off_letter_validate_remark: {
        type: String,
        required: false,
        default: ""
    },
    pre_expe_letter_validate_remark: {
        type: String,
        required: false,
        default: ""
    },
    pre_relieving_letter_validate_remark: {
        type: String,
        required: false,
        default: ""
    },
    bankPassBook_Cheque_validate_remark: {
        type: String,
        required: false,
        default: ""
    },
    joining_date_extend: {
        type: Date,
        required: false,
        default: ""
    },
    joining_date_extend_status: {
        type: String,
        required: false,
        default: ""
    },
    joining_date_extend_reason: {
        type: String,
        required: false,
        default: ""
    },
    joining_date_reject_reason: {
        type: String,
        required: false,
        default: ""
    },
    UID: {
        type: String,
        required: false,
        default: ""
    },
    pan: {
        type: String,
        required: false,
        default: ""
    },
    highest_upload: {
        type: String,
        required: false,
        default: ""
    },
    other_upload: {
        type: String,
        required: false,
        default: ""
    },
    tenth_marksheet: {
        type: String,
        required: false,
        default: ""
    },
    twelveth_marksheet: {
        type: String,
        required: false,
        default: ""
    },
    UG_Marksheet: {
        type: String,
        required: false,
        default: ""
    },
    passport: {
        type: String,
        required: false,
        default: ""
    },
    pre_off_letter: {
        type: String,
        required: false,
        default: ""
    },
    pre_expe_letter: {
        type: String,
        required: false,
        default: ""
    },
    pre_relieving_letter: {
        type: String,
        required: false,
        default: ""
    },
    bankPassBook_Cheque: {
        type: String,
        required: false,
        default: ""
    },
    joining_extend_document: {
        type: String,
        required: false,
        default: ""
    },
    userSalaryStatus: {
        type: Number,
        required: false,
        default: 0
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
    guardian_name: {
        type: String,
        required: false,
        default: ""
    },
    guardian_address: {
        type: String,
        required: false,
        default: ""
    },
    relation_with_guardian: {
        type: String,
        required: false,
        default: ""
    },
    gaurdian_number: {
        type: Number,
        required: false,
        default: null
    },
    emergency_contact1: {
        type: Number,
        required: false,
        default: 0
    },
    emergency_contact2: {
        type: Number,
        required: false,
        default: 0
    },
    offer_letter_send: {
        type: Boolean,
        required: false,
        default: false
    },
    annexure_pdf: {
        type: String,
        required: false,
        default: ""
    },
    profileflag: {
        type: Number,
        required: false,
        default: 0
    },
    nick_name: {
        type: String,
        required: false,
        default: ""
    },
    offer_later_date: {
        type: Date,
        required: false,
        default: ""
    },
    offer_later_acceptance_date: {
        type: Date,
        required: false,
        default: ""
    },
    offer_later_status: {
        type: Boolean,
        required: false,
        default: false
    },
    offer_later_reject_reason: {
        type: String,
        required: false,
        default: ""
    },
    offer_later_pdf_url: {
        type: String,
        required: false,
        default: ""
    },
    first_login_flag: {
        type: Number,
        required: false,
        default: false
    },
    sms_time: {
        type: Date,
        required: false,
        default: ""
    },
    showOnboardingModal: {
        type: Boolean,
        default: true
    },
    latitude: {
        type: Number,
        required: false,
        default: 0
    },
    longitude: {
        type: Number,
        required: false,
        default: 0
    },
    coc_flag: {
        type: Boolean,
        default: false,
        required: false
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
        default: 0
    },
    cast_type: {
        type: String,
        required: false,
        default: ""
    },
    emergency_contact_person_name1: {
        type: String,
        required: false,
        default: ""
    },
    emergency_contact_relation1: {
        type: String,
        required: false,
        default: "false"
    },
    emergency_contact_relation2: {
        type: String,
        required: false,
        default: ""
    },
    document_percentage_mandatory: {
        type: String,
        required: false,
        default: ""
    },
    document_percentage_non_mandatory: {
        type: String,
        required: false,
        default: ""
    },
    document_percentage: {
        type: String,
        required: false,
        default: ""
    },
    show_rocket: {
        type: Boolean,
        required: true,
        default: true
    },
    bank_type: {
        type: String,
        required: false,
        default: ''
    },
    bank_proof_image: {
        type: [String],
        required: false,
    },
    year_salary: {
        type: Number,
        required: false,
        default: 0
    },
    created_date_time: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model('userSecondModel', userSecondModel);