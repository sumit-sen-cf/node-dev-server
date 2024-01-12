const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

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

campaignCategoryModel.pre('save', async function (next) {
  if (!this.campaignCategory_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'campaignCategory_id': -1 } });

    if (lastAgency && lastAgency.campaignCategory_id) {
      this.campaignCategory_id = lastAgency.campaignCategory_id + 1;
    } else {
      this.campaignCategory_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("campaignCategoryModel", campaignCategoryModel);
