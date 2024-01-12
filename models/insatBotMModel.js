const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const botMSchema = new mongoose.Schema({
  botMId: {
    type: Number,
    required: false,
    unique: true,
  },
  number: {
    type: Number,
    unique: true,
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

module.exports = mongoose.model("instaBotMModel", botMSchema);
