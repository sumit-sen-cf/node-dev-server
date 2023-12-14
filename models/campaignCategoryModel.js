const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const campaignCategoryModel = new mongoose.Schema({
  campaignCategory_id: {
    type: Number,
    required: true,
  },
  campaignCategory_name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  campaign_id: {
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
campaignCategoryModel.plugin(AutoIncrement.plugin, {
  model: "campaignCategoryModels",
  field: "campaignCategory_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("campaignCategoryModel", campaignCategoryModel);
