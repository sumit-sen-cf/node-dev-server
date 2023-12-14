const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const brandSubCategoryModel = new mongoose.Schema({
  brandSubCategory_id: {
    type: Number,
    required: true,
  },
  brandSubCategory_name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  brandCategory_id: {
    type: Number,
    required: true,
  },
  created_by: {
    type: Number,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

AutoIncrement.initialize(mongoose.connection);
brandSubCategoryModel.plugin(AutoIncrement.plugin, {
  model: "brandSubCategoryModels",
  field: "brandSubCategory_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("brandSubCategoryModel", brandSubCategoryModel);
