const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const assignmentSchema = new mongoose.Schema({
  ass_id: {
    type: Number,
  },
  ass_to: {
    // type:mongoose.SchemaTypes.ObjectId,
    // ref:'ExpertiseModel',
    type: String,
  },
  exp_name:{
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
    enum: ['active', 'inactive', 'replaced', 'replacement', 'pending','rejected']
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
    type: String,
  },
  ass_status: {
    type: String,
    
    enum: ['assigned','unassigned','pending','executed', 'verified', 'rejected']
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
    default : ""
  }

});

AutoIncrement.initialize(mongoose.connection);
assignmentSchema.plugin(AutoIncrement.plugin, {
  model: "assignmentModel",
  field: "ass_id",
  startAt: 1,
  incrementBy: 1,
});

// assignmentSchema.pre(['save', 'findOneAndUpdate'], async function (next) {
//   try {
//     const existingExpertise = await mongoose.model('assignmentModel').findOne({ ass_to: this.ass_to });

//     // Set assignment_status based on the existence of the expertise document
//     if(existingExpertise) next()
//     if (!existingExpertise) {
//       this.ass_status = 'unassigned';
//     } 
//     next();
//   } catch (error) {
//     next(error);
//   }})



module.exports = mongoose.model(
  "assignmentModel",
  assignmentSchema
);
