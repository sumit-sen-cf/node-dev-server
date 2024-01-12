const mongoose = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const demoModel = new mongoose.Schema({
  t1: {
    type: String,
    required: true
  },
  t2: {
    type: String,
    required: false
  },
  t3: {
    type: String,
    required: false
  },
  t4: {
    type: Number,
    required: true
  },
  t5: {
    type: Number,
    required: false
  },
  t6: {
    type: Number,
    required: false
  },
  t7: {
    type: Boolean,
    required: true
  },
  t8: {
    type: Boolean,
    required: false
  },
  t9: {
    type: Boolean,
    required: false
  },
  t10: {
    type: Date,
    required: true,
    default: Date.now
  },
  t11: {
    type: Date,
    default: Date.now
  },
  t12: {
    type: Date,
    default: Date.now
  },
  t13 : {
    type: String,
    required: false,
    default: ""
  }
});

module.exports = mongoose.model("demoModel", demoModel);