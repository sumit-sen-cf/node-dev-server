const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const vendorBusiTypeModel = new mongoose.Schema(
    {
        busi_type_name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: false,
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
            required: false,
            default: 0,
        },
        status: {
            type: Number,
            required: false,
            default: constant?.ACTIVE,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("vendorBusiTypeModel", vendorBusiTypeModel);
