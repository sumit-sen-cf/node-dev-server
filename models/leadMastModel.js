const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const leadMastSchema = new mongoose.Schema({
  leadmast_id: {
    type: Number,
    required: false,
    unique: true,
  },
  lead_name: {
    type: String,
    default: ""
  },
  mobile_no: {
    type: String,
    default: ""
  },
  alternate_mobile_no: {
    type: String,
    default: ""
  },
  leadsource:{
    type:Number,
    required:false
  },
  leadtype:{
    type:Number,
    required:false
  },
  dept:{
    type:Number,
    required:false
  },
  status: {
    type: String,
    default: ""
  },
  loc:{
    type:Number,
    required:false
  },
  email: {
    type: String,
    default: ""
  },
  addr: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    default: ""
  },
  remark: {
    type: String,
    default: ""
  },
  Creation_date: {
    type: Date,
    default: Date.now,
  },
  Created_by: {
    type: Number
  },
  Last_updated_by: {
    type: Number
  },
  Last_updated_date: {
    type: Date
  },
  assign_to:{
    type:Number,
    required: false
  }
});

leadMastSchema.pre('save', async function (next) {
  if (!this.leadmast_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'leadmast_id': -1 } });

    if (lastAgency && lastAgency.leadmast_id) {
      this.leadmast_id = lastAgency.leadmast_id + 1;
    } else {
      this.leadmast_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("leadMastModel", leadMastSchema);