const mongoose = require("mongoose");
const constant = require("../../common/constant");
const Schema = mongoose.Schema;

const pagePriceMultipleSchema = new Schema({
    page_master_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Pms2VendorPlatformModel"
    },
    page_price_type_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Pms2PagePriceTypeModel"
    },
    price: {
        type: Number,
        required: false,
    },
    created_by: {
        type: Number,
        required: false,
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
    timestamps: true
});
const pagePriceMultipleModel = mongoose.model("Pms2PagePriceMultipleModel", pagePriceMultipleSchema);
module.exports = pagePriceMultipleModel;
