const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const assetsCategoryModel = new mongoose.Schema({
  category_id: {
    type: Number,
    required: false,
  },
  category_name: {
    type: String,
    required: false,
    unique: true,
    default: "",
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: Number,
    required: false,
    default: 0,
  },
  last_updated_by: {
    type: Number,
    default: 0
  },
  last_updated_date: {
    type: Date,
    default: 0
  },
  selfAuditPeriod: {
    type: Number,
    required: false,
    default: 0,
  },
  selfAuditUnit: {
    type: String,
    required: false,
    default: "",
  },
  hrAuditPeriod: {
    type: Number,
    required: false,
    default: 0,
  },
  hrAuditUnit: {
    type: String,
    required: false,
    default: "",
  },
});

assetsCategoryModel.pre('save', async function (next) {
  if (!this.category_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'category_id': -1 } });

    if (lastAgency && lastAgency.category_id) {
      this.category_id = lastAgency.category_id + 1;
    } else {
      this.category_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("assetsCategoryModel", assetsCategoryModel);
