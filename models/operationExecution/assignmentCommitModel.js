const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

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

AutoIncrement.initialize(mongoose.connection);
assignmentCommitSchema.plugin(AutoIncrement.plugin, {
  model: "AssignmentCommitModel",
  field: "comm_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model(
  "AssignmentCommitModel",
  assignmentCommitSchema
);
