const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pmsVendorPagePriceSchema = new Schema({
    platform_price_id: {
        type: Schema.Types.ObjectId,
        required: true,
      ref: "pmsPlatformPrice"
    },
    pageMast_id: {
        type: Number,
        required: true,
    },
    vendorMast_Id: {
        type: Number,
        required: true,
    },
    price_type_id: {
        type: Schema.Types.ObjectId,
        required: true,
         ref: "pmsPriceType"
    },
    price_cal_type: {
        type: String,
        required: true,
    },
    variable_type: {
        type: String,
        required: false,
    },
    price_fixed: {
        type: String,
        required: true,
    },
    price_variable: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    created_date_time: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: Number,
        required: true,
        default: 0,
    },
    last_updated_date: {
        type: Date,
        default: Date.now,
    },
    last_updated_by: {
        type: Number,
        required: false,
        default: 0
    }
});

const pmsVendorPagePriceModel = mongoose.model("pmsVendorPagePrice", pmsVendorPagePriceSchema);
module.exports = pmsVendorPagePriceModel;