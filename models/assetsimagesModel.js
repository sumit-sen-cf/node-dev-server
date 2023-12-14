const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const assetsImagesModel = new mongoose.Schema({
  asset_image_id: {
    type: Number,
    required: true,
  },
  sim_id: {
    type: Number,
    required: true,
  },
  uploaded_date: {
    type: Date,
    default: Date.now,
  },
  img1: {
    type: String,
    required: false,
    default: "",
  },
  img2: {
    type: String,
    required: false,
    default: "",
  },
  img3: {
    type: String,
    required: false,
    default: "",
  },
  img4: {
    type: String,
    required: false,
    default: "",
  },
  uploaded_by: {
    type: Number,
    required: false,
    default: 0,
  },
  type: {
    type: String,
    required: false,
    default: "",
  },
});

AutoIncrement.initialize(mongoose.connection);
assetsImagesModel.plugin(AutoIncrement.plugin, {
  model: "assetsImagesModels",
  field: "asset_image_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("assetsImagesModel", assetsImagesModel);
