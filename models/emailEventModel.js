const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const emailEventModel = new mongoose.Schema({
  event_name:{
    type: String,
    required: false
  },
  remarks: {
    type: String,
    required: false,
    default: "",
  },
  created_by: {
    type: Number,
    required: false,
    default: 0,
  },
  creation_date: {
    type: Date,
    default: Date.now,
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

module.exports = mongoose.model("emailEventModel", emailEventModel);