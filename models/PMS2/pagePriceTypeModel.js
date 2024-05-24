const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const pagePriceTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    platfrom_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Pms2VendorPlatformModel"
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
    },
}, {
    timestamps: true,
});
const pagePriceTypeModel = mongoose.model("Pms2PagePriceTypeModel", pagePriceTypeSchema);
module.exports = pagePriceTypeModel;
