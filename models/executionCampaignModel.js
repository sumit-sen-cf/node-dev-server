const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const exeCampaignSchema = new mongoose.Schema({
  exeCmpId: {
    type: Number,
    required: true,
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

AutoIncrement.initialize(mongoose.connection);
exeCampaignSchema.plugin(AutoIncrement.plugin, {
  model: "exeCampaignModel",
  field: "exeCmpId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("exeCampaignModel", exeCampaignSchema);
