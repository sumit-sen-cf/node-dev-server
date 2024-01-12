const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const assetReasonModel = new mongoose.Schema({
    asset_reason_id: {
        type: Number,
        required: false,
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

assetReasonModel.pre('save', async function (next) {
    if (!this.asset_reason_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'asset_reason_id': -1 } });
  
      if (lastAgency && lastAgency.asset_reason_id) {
        this.asset_reason_id = lastAgency.asset_reason_id + 1;
      } else {
        this.asset_reason_id = 1;
      }
    }
    next();
});

module.exports = mongoose.model(
    "assetReasonModel",
    assetReasonModel
);
