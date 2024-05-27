const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const countryCodeSchema = new Schema(
    {
        country_name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        code: {
            type: String,
            required: false,
            trim: true,
            default: "",
        },
        phone: {
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
const countryCodeModel = mongoose.model("Pms2CountryCodeModel", countryCodeSchema);
module.exports = countryCodeModel;
