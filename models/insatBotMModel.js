const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const botMSchema = new mongoose.Schema({
  botMId: {
    type: Number,
    required: true,
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

AutoIncrement.initialize(mongoose.connection);
botMSchema.plugin(AutoIncrement.plugin, {
  model: "instaBotMModel",
  field: "botMId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("instaBotMModel", botMSchema);
