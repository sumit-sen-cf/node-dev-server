const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const leadSchema = new mongoose.Schema({
  leadsource_id: {
    type: Number,
    required: false,
    unique: true,
  },
  leadsource_name: {
    type: String,
    default: ""
  },
  remark: {
    type: String,
    default: ""
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: Number
  },
  Last_updated_by: {
    type: Number
  },
  Last_updated_date: {
    type: Date
  },
});

leadSchema.pre('save', async function (next) {
  if (!this.leadsource_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'leadsource_id': -1 } });

    if (lastAgency && lastAgency.leadsource_id) {
      this.leadsource_id = lastAgency.leadsource_id + 1;
    } else {
      this.leadsource_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("leadModel", leadSchema);