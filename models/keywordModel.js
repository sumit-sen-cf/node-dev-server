const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const keywordSchema = new mongoose.Schema({
  keywordId: {
    type: Number,
    required: false,
    unique: true,
  },
  keyword: {
    type: String,
    lowercase: true,
    trim: true,
    default: "",
  },
  createdBy: {
    type: Number,
    default:0
  },
  createdAt: {
    type: Date,
    default:Date.now()
  },
  updatedBy: {
    type: Number,
    default:0
  },
  status: {
    type: Number
  },
  updatedAt: {
    type: Date
  },
});

module.exports = mongoose.model("keywordModel", keywordSchema);
