const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const leadRemarkSchema = new mongoose.Schema({
  leadremark_id: {
    type: Number,
    required: false,
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

leadRemarkSchema.pre('save', async function (next) {
  if (!this.leadremark_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'leadremark_id': -1 } });

    if (lastAgency && lastAgency.leadremark_id) {
      this.leadremark_id = lastAgency.leadremark_id + 1;
    } else {
      this.leadremark_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("leadRemarkModel", leadRemarkSchema);