const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const userModel = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true
    },
    user_designation: {
        type: Number,
        required: [true, "designation is Required"]
    },
    user_email_id: {
        type: String,
        required: false,
        unique: true,
        default: ""
    },
    user_login_id: {
        type: String,
        required: [true, "User Login Id is Required"],
        unique: true,
        default: ""
    },
    user_login_password: {
        type: String,
        required: [true, "Password is Required"],
        default: ""
    },
    user_name: {
        type: String,
        required: [true, "Name is Required"],
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
        required: [true, "Departent Id is required"],
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
        required: [true, "Role is Required"],
        default: 0
    },
    sitting_id: {
        type: Number,
        required: false,
        default: 0
    },
    job_type: {
        type: String,
        required: [true, "Job Type is Required"],
        default: ""
    },
    PersonalNumber: {
        type: Number,
        required: [true, "PersonalNumber Is Required"],
        unique: false,
        default: 0
    },
    Report_L1: {
        type: Number,
        required: [true, "Report L1 is Required"],
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
        required: [true, "PersonalEmail Is Required"],
        unique: false,
        default: ""
    },
    joining_date: {
        type: Date,
        required: [true, "Joining Date is Required"]
    },
    releaving_date: {
        type: Date,
        default: Date.now
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
        required: [true, "Spoken language is Required"],
        default: ""
    },
    Gender: {
        type: String,
        required: [true, "Gender is Required"],
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
        required: [true, "DOB is Required"]
    },
    Age: {
        type: Number,
        required: false,
        default: 0
    },
    fatherName: {
        type: String,
        required: [true, "father name is Required"],
        default: ""
    },
    motherName: {
        type: String,
        required: [true, "Mother name is Required"],
        default: ""
    },
    Hobbies: {
        type: String,
        required: false,
        default: ""
    },
    BloodGroup: {
        type: String,
        required: [true, "Blood group is Required"],
        default: ""
    },
    MartialStatus: {
        type: String,
        required: [true, "Maritial status is Required"],
        default: ""
    },
    DateOfMarriage: {
        type: Date,
        default: Date.now
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
        required: [true, "user status is Required"],
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
        required: [true, "sub dept id is Required"],
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
        required: [true, "Permanent city is Required"],
        default: ""
    },
    permanent_state: {
        type: String,
        required: [true, "permanent state is Required"],
        default: ""
    },
    permanent_pin_code: {
        type: Number,
        required: [true, "permanent pincode is Required"],
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
        required: [true, "Profile image is Required"],
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
        required: [true, "Digital signature is Required"],
        default: ""
    },
    bank_name: {
        type: String,
        required: [true, "bank name is Required"],
        default: ""
    },
    ifsc_code: {
        type: String,
        required: [true, "ifsc is Required"],
        default: ""
    },
    account_no: {
        type: String,
        required: [true, "account number is Required"],
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
        required: [true, "EME contact is Required"],
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
        required: [true, "Alt. Number is Required"],
        default: null
    },
    cast_type: {
        type: String,
        required: false,
        default: ""
    },
    emergency_contact_person_name1: {
        type: String,
        required: [true, "EME contact person name is Required"],
        default: ""
    },
    emergency_contact_relation1: {
        type: String,
        required: [true, "EME contact relation is Required"],
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
    }
});

AutoIncrement.initialize(mongoose.connection);
userModel.plugin(
    AutoIncrement.plugin,
    { model: 'userModels', field: 'user_id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('userModel', userModel);