const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const documentHisModel = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true
  },
  doc_id: {
    type: String,
    required: true
  },
  doc_file: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
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

module.exports = mongoose.model("documentHisModel", documentHisModel);