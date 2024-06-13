const { required } = require("joi");
const { default: mongoose } = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const documentDetailsSchema = new mongoose.Schema({
    vendor_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pms2VendorModel"
    },
    document_master_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "accountDocumentMasterModel",
    },
    document_name: {
        type: String,
        required: false
    },
    document_image_upload: {
        type: String,
        required: false
    },
    document_no: {
        type: String,
        required: false
    },
    document_type: {
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

module.exports = mongoose.model("Pms2DocumentDetailsModel", documentDetailsSchema);