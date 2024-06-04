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
    payment_method: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pms2paymentmethodmodels"
    },
    primary_page: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "pms2pagemastermodels"
    },
    page_count: {
        type: Number,
        required: false,
        default: 0
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
    pan_no: {
        type: String,
        required: false
    },
    pan_image: {
        type: String,
        required: false
    },
    gst_no: {
        type: String,
        required: false
    },
    gst_image: {
        type: String,
        required: false
    },
    company_name: {
        type: String,
        required: false
    },
    company_address: {
        type: String,
        required: false
    },
    company_city: {
        type: String,
        required: false
    },
    company_pincode: {
        type: Number,
        required: false,
        default: 0
    },
    company_state: {
        type: String,
        required: false
    },
    threshold_limit: {
        type: String,
        required: false,
        default: ""
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
