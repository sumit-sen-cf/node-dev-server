const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const vendorGroupLinkSchema = new Schema(
    {
        vendor_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "pms2VendorModel"
        },
        type: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "pms2grouplinktypemodels"
        },
        link: {
            type: String,
            required: true,
            trim: true,
            default: "",
        },
        purpose: {
            type: String,
            trim: true,
            default: "",
        },
        created_by: {
            type: Number,
            required: true,
            default: 0,
        },
        last_updated_by: {
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
const vendorGroupLinkModel = mongoose.model("Pms2VendorGroupLinkModel", vendorGroupLinkSchema);
module.exports = vendorGroupLinkModel;
