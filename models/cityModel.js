const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const cityModel = new mongoose.Schema({
  city_name: {
    type: String,
    required: true,
    unique :true
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

module.exports = mongoose.model("cityModel", cityModel);