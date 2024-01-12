const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const botWSchema = new mongoose.Schema({
  botWId: {
    type: Number,
    required: false,
    unique: true,
  },
  websiteName: {
    type: String,
    lowercase: true,
    trim: true,
    default: "",
  },
  campaign_id: {
    type: Number,
    default:0
  },
  createdBy: {
    type: Number,
    default:0
  },
  createdAt: {
    type: Date,
    default:Date.now()
  },
  status: {
    type: Number,
    default:""
  },
  
});

module.exports = mongoose.model("instaBotWModel", botWSchema);