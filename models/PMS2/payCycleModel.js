const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const payCycleSchema = new Schema(
    {
        cycle_name: {
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
const payCycleModel = mongoose.model("Pms2PayCycleModel", payCycleSchema);
module.exports = payCycleModel;
