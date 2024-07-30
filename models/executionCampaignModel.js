const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
const constant = require("../common/constant");
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
    unique: true,
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
    type: Schema.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  agency_id: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  created_by: {
    type: Number,
    required: false
  },
  updated_by: {
    type: Number,
    required: false
  },
  status: {
    type: Number,
    required: false,
    default: constant?.ACTIVE,
  },
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