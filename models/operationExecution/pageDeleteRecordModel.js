const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const pageDeleteRecordSchema = new mongoose.Schema({
  plan_id:{
    type:String,
    required: [true,'plan_id is required'],
  },
  phase_id:{
    type:String,
  },
  ass_id:{
    type:String,
  },
  plan_name:{
    type:String,
    // required: [true,'plan_name is required'],
  },
  campaignId:{
    type:String,
    required: [true,'campaign_id is required'],
  },
  campaignName:{
    type:String,
    // required: [true,'campaign_name is required'],
  },
  deletion_request_by:{
    type:String,
  },
  deleted_page:{
    type:Number,
    required: [true,'page_id is required'],
  },
  page_name:{
    type:String,
    required: [true,'page_name is required'],
  },
 
  // deletion_status:{
  //   type:String,
  //   default:'pending',
  //   enum:['pending', 'approved', 'disapproved']
  // },
  deletion_stage:{
    type:String,
    enum:['plan','phase','execution']
  },
  approved_by:{
    type:String
  },
  deletion_requested_at:{
    type:Date,
    default:Date.now()
  },
  deletion_result_at:{
    type:Date,
    
  }
});


module.exports = mongoose.model(
  "pageDeleteRecordModel",
  pageDeleteRecordSchema
);
