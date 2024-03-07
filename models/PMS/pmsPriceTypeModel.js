const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pmsPriceTypeSchema = new Schema({
    price_type: {
        type: String,
        required: true
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
const pmsPriceTypeModel = mongoose.model("pmsPriceType", pmsPriceTypeSchema);
module.exports = pmsPriceTypeModel;