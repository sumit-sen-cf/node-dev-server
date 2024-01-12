const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const assetModalModel = new mongoose.Schema({
  asset_modal_id: {
    type: Number,
    required: false,
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

assetModalModel.pre('save', async function (next) {
  if (!this.asset_modal_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'asset_modal_id': -1 } });

    if (lastAgency && lastAgency.asset_modal_id) {
      this.asset_modal_id = lastAgency.asset_modal_id + 1;
    } else {
      this.asset_modal_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model(
    "assetModalModel",
    assetModalModel
);
