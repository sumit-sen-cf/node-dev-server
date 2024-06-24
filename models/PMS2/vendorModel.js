const mongoose = require("mongoose");
const constant = require("../../common/constant");
const { required } = require("joi");
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
    vendor_type: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "pms2vendortypemodels"
    },
    vendor_platform: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pms2vendorplatformmodels"
    },
    pay_cycle: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pms2paycyclemodels"
    },
    // payment_method: {
    //     type: Schema.Types.ObjectId,
    //     required: true,
    //     ref: "pms2paymentmethodmodels"
    // },
    primary_page: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "pms2pagemastermodels"
    },
    bank_name: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "pms2BankNameModel"
    },
    // company_details: {
    //     type: Schema.Types.ObjectId,
    //     required: false,
    //     ref: "Pms2CompanyDetailsModel"
    // },
    page_count: {
        type: Number,
        required: false,
        default: 0
    },
    closed_by: {
        type: Number,
        required: false,
        default: 0
    },
    primary_field: {
        type: String,
        required: false,
    },
    vendor_name: {
        type: String,
        required: true,
        unique: true
    },
    country_code: {
        type: Number,
        required: false
    },
    mobile: {
        type: Number,
        required: false
    },
    alternate_mobile: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    personal_address: {
        type: String,
        required: false
    },
    home_pincode: {
        type: Number,
        required: false
    },
    home_address: {
        type: String,
        required: false
    },
    home_city: {
        type: String,
        required: false
    },
    home_state: {
        type: String,
        required: false
    },
    vendor_category: {
        type: String,
        required: false,
        enum: ["Theme Page", "Influencer"]
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
    updated_by: {
        type: Number,
        reqxuired: false,
        default: 0,
    },
    status: {
        type: Number,
        required: false,
        default: constant?.ACTIVE,
    },
},
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Pms2VendorModel", vendorSchema);
