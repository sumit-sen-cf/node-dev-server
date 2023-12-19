const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const assetBrandModel = new mongoose.Schema({
  asset_brand_id: {
    type: Number,
    required: true,
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

AutoIncrement.initialize(mongoose.connection);
assetBrandModel.plugin(AutoIncrement.plugin, {
  model: "assetBrandModels",
  field: "asset_brand_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model(
    "assetBrandModel",
    assetBrandModel
);
