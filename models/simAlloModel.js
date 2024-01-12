const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const simAlloModel = new mongoose.Schema({
  allo_id: {
    type: Number,
    required: false,
  },
  user_id: {
    type: Number,
    required: true,
  },
  sim_id: {
    type: Number,
    required: true,
  },
  category_id: {
    type: Number,
    required: false,
  },
  sub_category_id: {
    type: Number,
    required: false,
  },
  Remarks: {
    type: String,
    required: false,
    default: "",
  },
  created_by: {
    type: Number,
    required: true,
  },
  Creation_date: {
    type: Date,
    default: Date.now,
  },
  submitted_at: {
    type: String,
    default: null,
  },
  submitted_by: {
    type: Number,
    required: false,
  },
  reason: {
    type: String,
    required: false,
    default: "",
  },
  status: {
    type: String,
    required: false,
    default: "",
  },
  deleted_status: {
    type: Number,
    required: false,
    default: 0,
  },
  assignment_type: {
    type: String,
    required: false,
    default: "",
  },
  repair_status: {
    type: String,
    required: false,
    default: "",
  },
});

simAlloModel.pre('save', async function (next) {
  if (!this.allo_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'allo_id': -1 } });

    if (lastAgency && lastAgency.allo_id) {
      this.allo_id = lastAgency.allo_id + 1;
    } else {
      this.allo_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("simAlloModel", simAlloModel);
