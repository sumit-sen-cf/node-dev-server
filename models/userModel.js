const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const userModel = new mongoose.Schema({
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
        required: false,
        unique: true,
        default: ""
    },
    user_login_id: {
        type: String,
        required: false,
        unique: true,
        default: ""
    },
    user_login_password: {
        type: String,
        required: false,
        default: ""
    },
    user_name: {
        type: String,
        required: false,
        unique: true,
        default: ""
    },
    user_report_to_id: {
        type: Number,
        required: false,
        default: 0
    },
    user_contact_no: {
        type: Number,
        required: false,
        unique: true,
        default: 0
    },
    dept_id: {
        type: Number,
        required: false,
        default: 0
    },
    location_id: {
        type: Number,
        required: false,
        default: 0
    },
    created_by: {
        type: Number,
        required: false,
        default: 0
    },
    role_id: {
        type: Number,
        required: false,
        default: 0
    },
    sitting_id: {
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
    Report_L2: {
        type: Number,
        required: false,
        default: 0
    },
    Report_L3: {
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
    level: {
        type: String,
        required: false,
        default: ""
    },
    room_id: {
        type: Number,
        required: false,
        default: 0
    },
    salary: {
        type: Number,
        required: false,
        default: 0
    },
    SpokenLanguages: {
        type: String,
        required: false,
        default: ""
    },
    Gender: {
        type: String,
        required: false,
        default: ""
    },
    Nationality: {
        type: String,
        required: false,
        default: ""
    },
    DOB: {
        type: Date,
        default: Date.now,
        required: false
    },
    Age: {
        type: Number,
        required: false,
        default: 0
    },
    fatherName: {
        type: String,
        required: false,
        default: ""
    },
    motherName: {
        type: String,
        required: false,
        default: ""
    },
    Hobbies: {
        type: [Number],
        required: false,
        default: []
    },
    BloodGroup: {
        type: String,
        required: false,
        default: ""
    },
    MartialStatus: {
        type: String,
        required: false,
        default: ""
    },
    DateOfMarriage: {
        type: Date,
        // default: Date.now
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
    onboard_status: {
        type: Number,
        required: false,
        default: 0
    },
    image_remark: {
        type: String,
        required: false,
        default: ""
    },
    image_validate: {
        type: String,
        required: false,
        default: ""
    },
    uid_remark: {
        type: String,
        required: false,
        default: ""
    },
    upi_Id: {
        type: String,
        required: false,
        default: ""
    },
    uid_validate: {
        type: String,
        required: false,
        default: ""
    },
    pan_remark: {
        type: String,
        required: false,
        default: ""
    },
    pan_validate: {
        type: String,
        required: false,
        default: ""
    },
    highest_upload_remark: {
        type: String,
        required: false,
        default: ""
    },
    highest_upload_validate: {
        type: String,
        required: false,
        default: ""
    },
    other_upload_remark: {
        type: String,
        required: false,
        default: ""
    },
    other_upload_validate: {
        type: String,
        required: false,
        default: ""
    },
    user_status: {
        type: String,
        required: false,
        default: "Active"
    },
    lastupdated: {
        type: Date,
        default: Date.now
    },
    created_At: {
        type: Date,
        default: Date.now
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
    bank_Account_No: {
        type: Number,
        required: false,
        default: 0
    },
    account_Type: {
        type: String,
        required: false,
        default: ""
    },
    branch_Name: {
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
    ctc: {
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
        default: null
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
        default: ""
    },
    emergency_contact_person_name2: {
        type: String,
        required: false,
        default: ""
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
    att_status: {
        type: String
    },
    year_salary: {
        type: Number,
        required: false,
        default: 0
    }
});

userModel.pre('save', async function (next) {
    if (!this.user_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'user_id': -1 } });

        if (lastAgency && lastAgency.user_id) {
            this.user_id = lastAgency.user_id + 1;
        } else {
            this.user_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model('userModel', userModel);