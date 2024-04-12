const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pmsPagePurchasePrice = new Schema({
    platform_id: {
        type: Schema.Types.ObjectId,
        required: true,
        //  ref: "pmsPlatform"
    },
    pageMast_id: {
        type: Number,
        required: true,
    },
    price_type_id: {
        type: Schema.Types.ObjectId,
        required: true,
        // ref: "pmsPriceType"
    },
    price_cal_type: {
        type: String,
        required: true,
    },
    variable_type: {
        type: String,
        required: false,
    },
    purchase_price: {
        type: Number,
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
module.exports = mongoose.model('pmsPagePurchasePrice', pmsPagePurchasePrice);