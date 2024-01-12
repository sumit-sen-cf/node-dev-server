const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const cocHisModel = new mongoose.Schema({
  coc_id: {
    type: String,
    required: true
  },
  display_sequence: {
    type: Number,
    required: true
  },
  heading: {
    type: String,
    required: true
  },
  sub_heading: {
    type: String,
    required: false,
    default: "",
  },
  sub_heading_sequence: {
    type: Number,
    required: false,
    default: 0.0,
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  updated_by: {
    type: Number,
    required: false,
    default: 0,
  },
  updated_date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("cocHisModel", cocHisModel);