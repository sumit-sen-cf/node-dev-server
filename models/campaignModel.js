const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const campaignSchema = new mongoose.Schema({
  campaign_id: {
    type: Number,
    required: false,
    unique: true,
  },
  campaign_name: {
    type: String,
    required: true,
  },
  hash_tag: {
    type: String,
    default: "",
  },
  campaign_image: {
    type: String,
    required:false,
    default: "",
  },

  user_id: {
    type: Number,
  },

  agency_id: {
    type: Number,
    required: true,
    default: 0,
  },
  status:{
    type:String,
    enum:['active', 'inactive']
  },
  updated_date: {
    type: Date,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  updated_by: {
    type: Number,
  },
  brand_id: {
    type: Number,
  }
});

campaignSchema.pre('save', async function (next) {
  if (!this.campaign_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'campaign_id': -1 } });

    if (lastAgency && lastAgency.campaign_id) {
      this.campaign_id = lastAgency.campaign_id + 1;
    } else {
      this.campaign_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("campaignModel", campaignSchema);
