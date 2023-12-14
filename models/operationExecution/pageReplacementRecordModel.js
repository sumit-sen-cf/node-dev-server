const { default: mongoose } = require("mongoose");
// const AutoIncrement = require("mongoose-auto-increment");

const pageReplacementRecordSchema = new mongoose.Schema({
  
    planName:{
      type:'String',
      // required: [true,'plan_name is required'],
    },
    campaign_id:{
      type:'String',
      required: [true,'campaign_id is required'],
    },
    campaign_name:{
      type:'String',
      // required: [true,'campaign_name is required'],
    },
    replacement_request_by:{
      type:'String',
    },
    newPage_id:{
      type:'String',
      required: [true,'newpage_id is required'],
    },
    oldPage_id:{
      type:'String',
      required: [true,'newpage_id is required'],
    },
    replacement_status:{
      type:'String',
      default:'pending',
      enum:['pending', 'approved', 'disapproved']
    },
    replacement_stage:{
      type:'String',
      enum:['plan','phase','execution']
    },
    approved_by:{
      type:'String'
    },
    replacement_requested_at:{
      type:Date,
      default:Date.now()
    },
    replacement_result_at:{
      type:Date,
      
    }
});


module.exports = mongoose.model(
  "pageReplacementRecordModel",
  pageReplacementRecordSchema
);
