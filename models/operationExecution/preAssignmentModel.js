const mongoose = require('mongoose')
const AutoIncrement = require("mongoose-auto-increment");

const preAssignmentSchema=new mongoose.Schema({
    pre_ass_id:{
        type:Number,
    },
    phase_id:{
        type:Number,
        required:[true,'phasee id is required']
    },
    ass_page:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'PhasePageModel'
    },

    pre_ass_to:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'ExpertiseModel'
    },
    status:{
        type:String,
        default:'pending',
        enum:['pending', 'accepted', 'rejected',"rejected_by_manager","accepted_by_other"]
    },
    rejectedReason:{
        type:String,
    }
})


AutoIncrement.initialize(mongoose.connection);
preAssignmentSchema.plugin(AutoIncrement.plugin, {
  model: "PreAssignmentModel",
  field: "pre_ass_id",
  startAt: 1,
  incrementBy: 1,
});

preAssignmentSchema.pre(/^find/,async function(next){
    this.populate({
        path:'pre_ass_to'
    })
    this.populate({
      path:'ass_page'
    })
    next()
  })
preAssignmentSchema.pre(/^create/,async function(next){
    this.populate({
        path:'pre_ass_to'
    })
    this.populate({
      path:'ass_page'
    })
    next()
  })
  
module.exports = mongoose.model(
    "PreAssignmentModel",
    preAssignmentSchema
  );