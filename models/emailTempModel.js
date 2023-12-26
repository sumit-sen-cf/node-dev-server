const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const emailTempModel = new mongoose.Schema({
  email_for:{
    type: String,
    required: false
  },
  email_for_id:{
    type: Number,
    required: false
  },
  email_content: {
    type: String,
    required: true
  },
  email_sub:{
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

module.exports = mongoose.model("emailTempModel", emailTempModel);