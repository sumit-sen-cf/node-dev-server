const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const objMastSchema = new mongoose.Schema({
  obj_id: {
    type: Number,
    required: false,
    unique: true,
  },
  obj_name: {
    type: String,
    unique: true,
    default: ""
  },
  soft_name: {
    type: String,
    default: "",
  },
  project_name: {
    type: String,
    default: "",
  },
  summary: {
    type: String,
    default: "",
  },
  screenshot: {
    type: String,
    default: "",
  },
  Dept_id: {
    type: Number,
    default: 0,
  },

  Created_by: {
    type: Number,
    default: 0,
  },
  Last_updated_by: {
    type: Number,
  },
  Last_updated_date: {
    type: Date,
  },
  Creation_date: {
    type: Date,
    default: Date.now,
  },
});

objMastSchema.pre('save', async function (next) {
  if (!this.obj_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'obj_id': -1 } });

    if (lastAgency && lastAgency.obj_id) {
      this.obj_id = lastAgency.obj_id + 1;
    } else {
      this.obj_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("objectModel", objMastSchema);