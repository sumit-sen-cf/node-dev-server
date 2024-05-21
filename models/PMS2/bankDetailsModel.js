const { required } = require("joi");
const { default: mongoose } = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const bankDetailsSchema = new mongoose.Schema({
    vendor_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pms2VendorModel"
    },
    bank_name: {
        type: String,
        required: true,
        trim: true,
    },
    account_type: {
        type: String,
        required: false,
    },
    account_number: {
        type: String,
        required: false,
    },
    ifcs: {
        type: String,
        required: false,
    },
    registered_number: {
        type: Number,
        required: false,
    },
    upi_id: {
        type: String,
        required: false,
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

module.exports = mongoose.model("Pms2VendorBankDetailsModel", bankDetailsSchema);