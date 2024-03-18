const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pmsPlatformPriceSchema = new Schema({
    platform_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pmsPlatform"
    },
    price_type_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "pmsPriceType"
    },
    description: {
        type: String,
        required: false
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
const pmsPlatformPriceModel = mongoose.model("pmsPlatformPrice", pmsPlatformPriceSchema);
module.exports = pmsPlatformPriceModel;