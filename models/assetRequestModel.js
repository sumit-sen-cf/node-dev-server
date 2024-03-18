const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const assetRequestModel = new mongoose.Schema({
    asset_request_id: {
        type: Number,
        required: false
    },
    sub_category_id: {
        type: Number,
        required: true
    },
    sim_id: {
        type: Number,
        required: false
    },
    detail: {
        type: String,
        required: false,
    },
    priority: {
        type: String,
        required: false,
    },
    date_and_time_of_asset_request: {
        type: Date,
        default: Date.now,
    },
    request_by: {
        type: Number,
        required: false,
    },
    multi_tag: {
        type: [Number],
        required: false,
        default: []
    },
    asset_request_status: {
        type: String,
        required: false,
        default: "Requested"
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

assetRequestModel.pre('save', async function (next) {
    if (!this.asset_request_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'asset_request_id': -1 } });

        if (lastAgency && lastAgency.asset_request_id) {
            this.asset_request_id = lastAgency.asset_request_id + 1;
        } else {
            this.asset_request_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model(
    "assetRequestModel",
    assetRequestModel
);
