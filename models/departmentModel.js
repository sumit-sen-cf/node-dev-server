const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const departmentModel = new mongoose.Schema({
  dept_id: {
    type: Number,
    required: false,
  },
  dept_name: {
    type: String,
    required: false,
    unique:true,
    default: "",
  },
  short_name: {
    type: String,
    required: false,
    unique:true,
    default: "",
  },
  Remarks: {
    type: String,
    required: false,
    default: "",
  },
  Creation_date: {
    type: Date,
    default: Date.now,
  },
  Created_by: {
    type: Number,
    required: false,
    default: 0,
  },
  Last_updated_by: {
    type: Number,
    default:0
  },
  Last_updated_date: {
    type: Date,
    default:0
  },
});

departmentModel.pre('save', async function (next) {
  if (!this.dept_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'dept_id': -1 } });

    if (lastAgency && lastAgency.dept_id) {
      this.dept_id = lastAgency.dept_id + 1;
    } else {
      this.dept_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("departmentModel", departmentModel);
