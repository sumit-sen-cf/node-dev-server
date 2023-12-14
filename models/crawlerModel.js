const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const crawlerModel = new mongoose.Schema({
  creatorName: {
    type: String,
    required: true,
    unique: [true,'creatorName is required and unique']
  },
  maxPostCountDay: {
    type: Number,
    required: false,
    default: 0
  },
  crawlerCount: {
    type: Number,
    required: false,
    default: 0
  },
  remark: {
    type: String,
    required: false,
    default: "",
  },
  updated_date: {
    type: Date,
    required: false,
    default: Date.now,
  }
});

module.exports = mongoose.model("crawlerModel", crawlerModel);