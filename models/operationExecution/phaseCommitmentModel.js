const { default: mongoose } = require("mongoose");
// const AutoIncrement = require("mongoose-auto-increment");

const phaseCommitmentSchema = new mongoose.Schema({
   
    campaignId:{
      type:String,
      required:[true,"campaignId is required"]
    },
    campaignName:{
      type:String,
      required:[true,"campaignName is required"]
    },
    commitment:{
      type:String,
      required:[true,'commitment is required']
    },
    value:{
      type:String,
      required:[true,'value is required']
    },
    planName:{
      type:String,
      required:[true,'plan name is required']
    },
    phase_id:{
      type:String,
    },
    phaseName:{
      type:String,
      required:[true,'phase name is required']
    }
});


module.exports = mongoose.model(
  "PhaseCommitmentModel",
  phaseCommitmentSchema
);
