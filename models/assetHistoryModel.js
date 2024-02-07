const { default: mongoose } = require("mongoose");

const assetHistoryModel = new mongoose.Schema({
    sim_id: {
        type: Number,
        required: false,
    },
    action_date_time: {
        type: Date,
        required: false,
        default: ""
    },
    action_by: {
        type: Number,
        required: false,
        default: 0
    },
    asset_detail: {
        type: String,
        required: false,
        default: ""
    },
    action_to: {
        type: Number,
        required: false,
        default: 0
    },
    asset_remark: {
        type: String,
        required: false,
        default: ""
    },
    asset_action: {
        type: String,
        required: false,
        default: ""
    }
});


module.exports = mongoose.model(
    "assetHistoryModel",
    assetHistoryModel
);
