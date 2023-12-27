const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const assetReasonModel = new mongoose.Schema({
    asset_reason_id: {
        type: Number,
        required: true,
    },
    category_id: {
        type: Number,
        required: true,
    },
    sub_category_id: {
        type: Number,
        required: true,
    },
    reason: {
        type: String,
        required: false,
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

AutoIncrement.initialize(mongoose.connection);
assetReasonModel.plugin(AutoIncrement.plugin, {
    model: "assetReasonModels",
    field: "asset_reason_id",
    startAt: 1,
    incrementBy: 1,
});
module.exports = mongoose.model(
    "assetReasonModel",
    assetReasonModel
);
