const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const assignmentSchema = new mongoose.Schema({
  ass_id: {
    type: Number,
  },
  ass_to: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'ExpertiseModel',
    // type: String,
  },
  exp_name: {
    type: String,
  },
  ass_by: {
    // type:mongoose.SchemaTypes.ObjectId,
    // ref:'userModels',
    type: String,
  },
  phase_id: {
    type: String,

  },
  phaseName: {
    type: String,
    required: [true, "phase name is required"]
  },
  plan_id: {
    type: String,
    // required: [true, "plan id is required"]
  },
  planName: {
    type: String,
    required: [true, "plan name is required."]
  },
  vendor_id: {
    type: String,
    // required: [true, "vendor is required"]
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
  storyPerPage: {
    type: Number,
    // required: [true, "story per page is required`"]
  },
  storyRemaining: {
    type: Number,
    default: this.storyPerPage
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
  created_at: {
    type: Date,
    defaule: Date.now(),
  },
  updated_at: {
    type: Date,
  },
  replacement_status: {
    type: String,
    default: 'inactive',
    enum: ['active', 'inactive', 'replaced', 'replacement', 'pending', 'rejected']
  },
  delete_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'pageDeleteRecordModel',
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
  replacement_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'pageReplacementRecordModel'
  },
  ass_status: {
    type: String,
    default: 'unassigned',
    enum: ['assigned', 'unassigned', 'pending', 'executed', 'verified', 'rejected']
  },
  executed_at: {
    type: Date
  },
  
  verified_by: {
    // type:mongoose.SchemaTypes.ObjectId,
    // ref:'userModels',
    type: String,
  },
  verified_at: {
    type: Date
  },
  verification_remark: {
    type: String,
  },
  updatedFrom: {
    type: String,
    default: ""
  },

  preAssignedTo: {
    type: Array,
    default: []
  },
  rejected_by: {
    type: Array,
    default: []
  },
  isExecuted: {
    type: Boolean,
    default: false,
  }

});

assignmentSchema.pre('save', async function (next) {
  if (!this.ass_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'ass_id': -1 } });

    if (lastAgency && lastAgency.ass_id) {
      this.ass_id = lastAgency.ass_id + 1;
    } else {
      this.ass_id = 1;
    }
  }
  next();
});

assignmentSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'ass_to'
  })

  this.populate({
    path: 'replacement_id',

  })

  this.populate({
    path: 'delete_id'
  })

  next()
})



module.exports = mongoose.model(
  "assignmentModel",
  assignmentSchema
);
