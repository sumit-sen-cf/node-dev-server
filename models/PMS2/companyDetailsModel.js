const { required } = require("joi");
const { default: mongoose } = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const companyDetailsSchema = new mongoose.Schema({
    vendor_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pms2VendorModel"
    },
    company_name: {
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
    pincode: {
        type: Number,
        required: false,
        default: 0
    },
    state: {
        type: String,
        required: false
    },
    threshold_limit: {
        type: String,
        required: false,
        default: ""
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
}, {
    timestamps: true
});

module.exports = mongoose.model("Pms2CompanyDetailsModel", companyDetailsSchema);