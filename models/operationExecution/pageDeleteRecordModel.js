const { default: mongoose } = require("mongoose");
// const AutoIncrement = require("mongoose-auto-increment");

const pageDeleteRecordSchema = new mongoose.Schema({
  plan_id:{
    type:'String',
    required: [true,'plan_id is required'],
  },
  plan_name:{
    type:'String',
    // required: [true,'plan_name is required'],
  },
  campaignId:{
    type:'String',
    required: [true,'campaign_id is required'],
  },
  campaignName:{
    type:'String',
    // required: [true,'campaign_name is required'],
  },
  deletion_request_by:{
    type:'String',
  },
  deleted_page:{
    type:'String',
    required: [true,'newpage_id is required'],
  },
 
  deletion_status:{
    type:'String',
    default:'pending',
    enum:['pending', 'approved', 'disapproved']
  },
  deletion_stage:{
    type:'String',
    enum:['plan','phase','execution']
  },
  approved_by:{
    type:'String'
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
