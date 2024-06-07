const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const bankNameSchema = new Schema(
    {
        sr_no: {
            type: Number,
            required: false,
            trim: true,
        },
        bank_name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        type_of_bank: {
            type: String,
            required: false,
            trim: true,
        },
        description: {
            type: String,
            required: false,
            trim: true,
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

module.exports = mongoose.model("pms2BankNameModel", bankNameSchema);