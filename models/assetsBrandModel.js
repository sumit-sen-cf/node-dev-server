const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const assetBrandModel = new mongoose.Schema({
  asset_brand_id: {
    type: Number,
    required: false,
  },
  asset_brand_name: {
    type: String,
    required: true,
    unique: true,
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

assetBrandModel.pre('save', async function (next) {
  if (!this.asset_brand_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'asset_brand_id': -1 } });

    if (lastAgency && lastAgency.asset_brand_id) {
      this.asset_brand_id = lastAgency.asset_brand_id + 1;
    } else {
      this.asset_brand_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model(
    "assetBrandModel",
    assetBrandModel
);
