const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const cocModel = new mongoose.Schema({
  display_sequence: {
    type: Number,
    required: true
  },
  heading: {
    type: String,
    required: true
  },
  heading_desc: {
    type: String,
    required: true
  },
  sub_heading: {
    type: String,
    required: false,
    default: "",
  },
  sub_heading_desc: {
    type: String,
    required: true
  },
  sub_heading_sequence: {
    type: Number,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  remarks: {
    type: String,
    required: false,
    default: "",
  },
  designed_by: {
    type: Number,
    required: false,
    default: 0,
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

module.exports = mongoose.model("cocModel", cocModel);