const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const assetModalModel = new mongoose.Schema({
  asset_modal_id: {
    type: Number,
    required: true,
  },
  asset_modal_name: {
    type: String,
    required: true,
    unique: true,
  },
  asset_brand_id : {
    type: Number,
    required: true
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
assetModalModel.plugin(AutoIncrement.plugin, {
  model: "assetModalModels",
  field: "asset_modal_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model(
    "assetModalModel",
    assetModalModel
);
