const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const assetRepairRequestSumModel = new mongoose.Schema({
    asset_repair_sum_id: {
        type: Number,
        required: false,
    },
    sim_id: {
        type: Number,
        required: false,
    },
    repair_request_date_time: {
        type: Date,
        required: false,
        default: ""
    },
    recovery_remark: {
        type: String,
        required: false,
        default: ""
    },
    recovery_image_upload1: {
        type: String,
        required: false,
        default: ""
    },
    recovery_image_upload2: {
        type: String,
        required: false,
        default: ""
    },
    recovery_by: {
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
    req_by: {
        type: Number,
        required: false,
    }
});

assetRepairRequestSumModel.pre('save', async function (next) {
    if (!this.asset_repair_sum_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'asset_repair_sum_id': -1 } });

        if (lastAgency && lastAgency.asset_repair_sum_id) {
            this.asset_repair_sum_id = lastAgency.asset_repair_sum_id + 1;
        } else {
            this.asset_repair_sum_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model(
    "assetRepairRequestSumModel",
    assetRepairRequestSumModel
);
