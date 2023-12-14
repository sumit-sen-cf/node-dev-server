const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const botWSchema = new mongoose.Schema({
  botWId: {
    type: Number,
    required: true,
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

AutoIncrement.initialize(mongoose.connection);
botWSchema.plugin(AutoIncrement.plugin, {
  model: "instaBotWModel",
  field: "botWId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("instaBotWModel", botWSchema);
