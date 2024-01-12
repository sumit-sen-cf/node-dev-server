const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const assetsImagesModel = new mongoose.Schema({
  asset_image_id: {
    type: Number,
    required: false,
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

assetsImagesModel.pre('save', async function (next) {
  if (!this.asset_image_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'asset_image_id': -1 } });

    if (lastAgency && lastAgency.asset_image_id) {
      this.asset_image_id = lastAgency.asset_image_id + 1;
    } else {
      this.asset_image_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("assetsImagesModel", assetsImagesModel);
