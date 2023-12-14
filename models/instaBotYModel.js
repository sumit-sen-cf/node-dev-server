const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const botYSchema = new mongoose.Schema({
  botYId: {
    type: Number,
    required: true,
    unique: true,
  },
  word: {
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
botYSchema.plugin(AutoIncrement.plugin, {
  model: "instaBotYModel",
  field: "botYId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("instaBotYModel", botYSchema);
