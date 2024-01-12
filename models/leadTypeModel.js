const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const leadTypeSchema = new mongoose.Schema({
  leadtype_id: {
    type: Number,
    required: false,
    unique: true,
  },
  location: {
    type: String,
    default: ""
  },
  lead_type: {
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
});

leadTypeSchema.pre('save', async function (next) {
  if (!this.leadtype_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'leadtype_id': -1 } });

    if (lastAgency && lastAgency.leadtype_id) {
      this.leadtype_id = lastAgency.leadtype_id + 1;
    } else {
      this.leadtype_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("leadTypeModel", leadTypeSchema);