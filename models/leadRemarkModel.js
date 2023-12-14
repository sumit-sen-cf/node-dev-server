const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const leadRemarkSchema = new mongoose.Schema({
  leadremark_id: {
    type: Number,
    required: true,
    unique: true,
  },
  leadmast_id: {
    type: Number,
    required: false,
  },
  call_update: {
    type: String,
    default: ""
  },
  callupdate_detail: {
    type: String,
    default: ""
  },
  lead_status: {
    type: String,
    default: ""
  },
  prospect_status: {
    type: String,
    default: ""
  },
  cust_owner: {
    type: String,
    default: ""
  },
  remark: {
    type: String,
    default: ""
  },
  remarkupd_date: {
    type: Date,
    default:Date.now
  },
  remarkupdate_time: {
    type: String,
    default: ""
  },
  followup_date: {
    type: Date
  },
  followup_time: {
    type: String,
    default: ""
  },
});

AutoIncrement.initialize(mongoose.connection);
leadRemarkSchema.plugin(AutoIncrement.plugin, {
  model: "leadRemarkModel",
  field: "leadremark_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("leadRemarkModel", leadRemarkSchema);

