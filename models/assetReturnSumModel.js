const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const assetReturnSumModel = new mongoose.Schema({
    asset_return_sum_id: {
        type: Number,
        required: false,
    },
    sim_id: {
        type: Number,
        required: false,
    },
    return_asset_data_time: {
        type: Date,
        required: false,
        default: ""
    },
    asset_return_remark: {
        type: String,
        required: false,
        default: ""
    },
    recover_asset_image_1: {
        type: String,
        required: false,
        default: ""
    },
    recover_asset_image_2: {
        type: String,
        required: false,
        default: ""
    },
    asset_return_by: {
        type: Number,
        required: false,
        default: 0
    },
    asset_return_recover_by: {
        type: Number,
        required: false,
        default: 0
    },
    asset_return_recover_by_remark: {
        type: String,
        required: false,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
});

assetReturnSumModel.pre('save', async function (next) {
    if (!this.asset_return_sum_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'asset_return_sum_id': -1 } });

        if (lastAgency && lastAgency.asset_return_sum_id) {
            this.asset_return_sum_id = lastAgency.asset_return_sum_id + 1;
        } else {
            this.asset_return_sum_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model(
    "assetReturnSumModel",
    assetReturnSumModel
);
