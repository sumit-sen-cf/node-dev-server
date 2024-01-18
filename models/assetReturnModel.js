const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const assetReturnModel = new mongoose.Schema({
    sim_id: {
        type: Number,
        required: false
    },
    return_asset_data_time: {
        type: Date,
        default: Date.now,
    },
    asset_return_remark: {
        type: String,
        required: false,
    },
    return_asset_image_1: {
        type: String,
        required: false,
    },
    return_asset_image_2: {
        type: String,
        required: false,
    },
    asset_return_by: {
        type: Number,
        required: false,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model(
    "assetReturnModel",
    assetReturnModel
);
