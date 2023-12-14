const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

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

AutoIncrement.initialize(mongoose.connection);
campaignPhaseSchema.plugin(AutoIncrement.plugin, {
  model: "CampaignPhaseModel",
  field: "phase_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model(
  "CampaignPhaseModel",
  campaignPhaseSchema
);
