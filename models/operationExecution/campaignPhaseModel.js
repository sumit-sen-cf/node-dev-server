const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const campaignPhaseSchema = new mongoose.Schema({
    phaseName:{
      type:String,
      required:[true,"Phase Name is required"]
    },
    phase_id:{
      type:String,

    },
    campaignName:{
      type:String,
      required:[true,"campaign Name is required"]
    },
    planName:{
      type:String,
      required:[true,"plan Name is required"]
    },
    description:{
      type:String,
      // required:[true,"campaign Name is required"]
    },
    campaignId:{
      type:String,
      required:[true,"campaign id is required"]
    },
    startDate:{
      type:Date,
    },
    endDate:{
      type:Date,
    },
    createdAt:{
      type:Date,
      default:Date.now(),
    },
    updatedAt:{
      type:Date,
      
    }
 
});

campaignPhaseSchema.pre('save', async function (next) {
  if (!this.phase_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'phase_id': -1 } });

    if (lastAgency && lastAgency.phase_id) {
      this.phase_id = lastAgency.phase_id + 1;
    } else {
      this.phase_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model(
  "CampaignPhaseModel",
  campaignPhaseSchema
);
