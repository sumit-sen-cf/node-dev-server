const mongoose = require('mongoose')
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const preAssignmentSchema = new mongoose.Schema({
  pre_ass_id: {
    type: Number,
  },
  campaignId: {
    type: String,
    
  },
  phase_id: {
    type: Number,
    required: [true, 'phasee id is required']
  },
  ass_page: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'PhasePageModel'
  },

  pre_ass_to: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'ExpertiseModel'
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'accepted', 'rejected', "rejected_by_manager", "accepted_by_other"]
  },
  rejectedReason: {
    type: String,
  }
})

preAssignmentSchema.pre('save', async function (next) {
  if (!this.pre_ass_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'pre_ass_id': -1 } });

    if (lastAgency && lastAgency.pre_ass_id) {
      this.pre_ass_id = lastAgency.pre_ass_id + 1;
    } else {
      this.pre_ass_id = 1;
    }
  }
  next();
});

preAssignmentSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'pre_ass_to'
  })
  this.populate({
    path: 'ass_page'
  })
  next()
})
preAssignmentSchema.pre(/^create/, async function (next) {
  this.populate({
    path: 'pre_ass_to'
  })
  this.populate({
    path: 'ass_page'
  })
  next()
})

module.exports = mongoose.model(
  "PreAssignmentModel",
  preAssignmentSchema
);