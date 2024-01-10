const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const registerCampaignSchema = new mongoose.Schema({
  register_campaign_id: {
    type: Number,
    required: true,
    unique: true,
  },
  brand_id: {
    type: Number,
  },
  brnad_dt: {
    type: Date,
  },
  excel_path: {
    type: String,
    default: "",
  },
  detailing: {
    type: String,
    default: "",
  },
captions:{
  type: Array,
  required:[true, "captions are required"]
},
hashtags:{
  type: String,
  required: [true, "hashtags are required"]

},
  //   commitment: [String],
  status: {
    type: Number,
  },
  exeCmpId: {
    type: Number,
    ref: "exeCampaignModel",
  },
  stage: {
    type: Number,
  },

  commitment: [mongoose.Schema.Types.Mixed],
});

AutoIncrement.initialize(mongoose.connection);
registerCampaignSchema.plugin(AutoIncrement.plugin, {
  model: "registerCampaignModel",
  field: "register_campaign_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model(
  "registerCampaignModel",
  registerCampaignSchema
);
