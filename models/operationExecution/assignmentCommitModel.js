const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const assignmentCommitSchema = new mongoose.Schema({
    comm_id:{
        type:'String',

    },
    phase_id:{
        type:'String',
        required: [true,'phase id is required']
    },
    campaignId:{
        type:'String',
        required: [true,'campaign id is required']
    },
    link:{
        type:'String',
        required: [true,'link is required']
    },
    snapshot:{
        type:'String',
    },
    ass_id:{
        type:'String',
        required:[true,'ass_id is required']
    },
    likes:{
        type:'Number',
        default: 0,
    },
    engagement:{
        type:'Number',
        default: 0,
    },
    comments:{
        type:'Number',
        default: 0,
    },
    reach:{
        type:'Number',
        default: 0,
    }
});

assignmentCommitSchema.pre('save', async function (next) {
    if (!this.comm_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'comm_id': -1 } });
  
      if (lastAgency && lastAgency.comm_id) {
        this.comm_id = lastAgency.comm_id + 1;
      } else {
        this.comm_id = 1;
      }
    }
    next();
});

module.exports = mongoose.model(
  "AssignmentCommitModel",
  assignmentCommitSchema
);
