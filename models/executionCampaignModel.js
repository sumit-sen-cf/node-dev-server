const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const exeCampaignSchema = new mongoose.Schema({
  exeCmpId: {
    type: Number,
    required: false,
    unique: true,
  },
  exeCmpName: {
    type: String,
    lowercase: true,
    trim: true,
  },
  exeHashTag: {
    type: String,
    default: "",
  },
  exeRemark: {
    type: String,
    default: "",
  },
  exeUserId: {
    type: Number,
  },

  agencyId: {
    type: Number,
  },
  updatedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: Number,
  },
  brandId: {
    type: Number,
  }
});

exeCampaignSchema.pre('save', async function (next) {
  if (!this.exeCmpId) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'exeCmpId': -1 } });

    if (lastAgency && lastAgency.exeCmpId) {
      this.exeCmpId = lastAgency.exeCmpId + 1;
    } else {
      this.exeCmpId = 1;
    }
  }
  next();
});

module.exports = mongoose.model("exeCampaignModel", exeCampaignSchema);