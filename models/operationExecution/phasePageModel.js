const { default: mongoose } = require("mongoose");
// const AutoIncrement = require("mongoose-auto-increment");

const phasePageSchema = new mongoose.Schema({
  phase_id: {
    type: String,

  },
  phaseName: {
    type: String,
    required: [true, "phase name is required"]
  },
  plan_id: {
    type: String,
    required: [true, "plan id is required"]
  },
  planName: {
    type: String,
    required: [true, "plan name is required."]
  },
  vendor_id: {
    type: String,
    required: [true, "vendor is required"]
  },
  p_id: {
    type: String,
    required: [true, "page id is required."]
  },
  postPerPage: {
    type: String,
    required: [true, 'post per page is required']
  },
  postRemaining: {
    type: String,
    default: this.postPerPage
  },
  campaignName: {
    type: String,
    required: [true, "campign name is required"]
  },
  campaignId: {
    type: String,
    required: [true, "campaign id is required"]
  },
  page_name: {
    type: String,
    // required:[true,"campaign id is required"]
  },
  cat_name: {
    type: String,
    // required:[true,"campaign id is required"]
  },
  platform: {
    type: String,
    // required:[true,"campaign id is required"]
  },
  follower_count: {
    type: String,
    // required:[true,"campaign id is required"]
  },
  page_link: {
    type: String,
    // required:[true,"campaign id is required"]
  },

  createdAt: {
    type: Date,
    default: Date.now()
  },
  modifiedAt: {
    type: Date
  },
  replacement_status: {
    type: String,
    default: 'inactive',
    enum: ['active', 'inactive', 'replaced', 'replacement', 'pending']
  },
  delete_status: {
    type: String,
    default: 'inactive',
    enum: ['active', 'inactive']
  },
  replaced_by: {
    type: String,
    default: 'N/A'
  },
  replaced_with: {
    type: String,
    default: 'N/A',
  },
  replacement_id:{
    type:mongoose.SchemaTypes.ObjectId,
   ref:'pageReplacementRecordModel',

}
});

phasePageSchema.pre(/^find/,async function(next){
  this.populate({
    path:'replacement_id'
  })
})


module.exports = mongoose.model(
  "PhasePageModel",
  phasePageSchema
);
