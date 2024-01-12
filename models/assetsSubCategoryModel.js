const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const assetsSubCategoryModel = new mongoose.Schema({
  sub_category_id: {
    type: Number,
    required: false,
  },
  sub_category_name: {
    type: String,
    required: false,
    unique:true,
    default: "",
  },
  category_id:{
    type: Number,
    required: true
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
    default:0
  },
  last_updated_date: {
    type: Date,
    default:0
  },
  inWarranty: {
    type: String,
    required: false,
    default: "",
  },
});

assetsSubCategoryModel.pre('save', async function (next) {
  if (!this.sub_category_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'sub_category_id': -1 } });

    if (lastAgency && lastAgency.sub_category_id) {
      this.sub_category_id = lastAgency.sub_category_id + 1;
    } else {
      this.sub_category_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("assetsSubCategoryModel", assetsSubCategoryModel);
