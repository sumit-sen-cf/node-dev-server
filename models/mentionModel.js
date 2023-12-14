const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const mentionSchema = new mongoose.Schema({
  mentionId: {
    type: Number,
    required: true,
    unique: true,
  },
  mention: {
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
  status: {
    type: Number
  },
});

AutoIncrement.initialize(mongoose.connection);
mentionSchema.plugin(AutoIncrement.plugin, {
  model: "mentionModel",
  field: "mentionId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("mentionModel", mentionSchema);
