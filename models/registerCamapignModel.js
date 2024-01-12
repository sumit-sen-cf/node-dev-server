const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const registerCampaignSchema = new mongoose.Schema({
  register_campaign_id: {
    type: Number,
    required: false,
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
  // required:[true, "captions are required"]
},
hashtags:{
  type: String,
  // required: [true, "hashtags are required"]

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

registerCampaignSchema.pre('save', async function (next) {
  if (!this.register_campaign_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'register_campaign_id': -1 } });

    if (lastAgency && lastAgency.register_campaign_id) {
      this.register_campaign_id = lastAgency.register_campaign_id + 1;
    } else {
      this.register_campaign_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model(
  "registerCampaignModel",
  registerCampaignSchema
);
