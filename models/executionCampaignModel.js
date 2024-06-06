const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const exeCampaignSchema = new mongoose.Schema({
  exe_campaign_id: {
    type: Number,
    unique: true,
    required: false,
  },
  exe_campaign_name: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
  },
  exe_hash_tag: {
    type: String,
    required: false,
    default: "",
  },
  exe_campaign_image: {
    type: String,
    required: false,
    default: "",
  },
  brand_id: {
    type: Number,
    required: false
  },
  user_id: {
    type: Number,
    required: false
  },
  agency_id: {
    type: Number,
    required: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive']
  },
  created_by: {
    type: Number,
    required: false
  },
  updated_by: {
    type: Number,
    required: false
  }
}, {
  timestamps: true
});

exeCampaignSchema.pre('save', async function (next) {
  if (!this.exe_campaign_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'exe_campaign_id': -1 } });

    if (lastAgency && lastAgency.exe_campaign_id) {
      this.exe_campaign_id = lastAgency.exe_campaign_id + 1;
    } else {
      this.exe_campaign_id = 20000;
    }
  }
  next();
});

module.exports = mongoose.model("exeCampaignModel", exeCampaignSchema);