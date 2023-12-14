const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const assetsSubCategoryModel = new mongoose.Schema({
  sub_category_id: {
    type: Number,
    required: true,
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
});

AutoIncrement.initialize(mongoose.connection);
assetsSubCategoryModel.plugin(AutoIncrement.plugin, {
  model: "assetsSubCategoryModels",
  field: "sub_category_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("assetsSubCategoryModel", assetsSubCategoryModel);
