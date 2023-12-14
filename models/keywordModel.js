const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const keywordSchema = new mongoose.Schema({
  keywordId: {
    type: Number,
    required: true,
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

AutoIncrement.initialize(mongoose.connection);
keywordSchema.plugin(AutoIncrement.plugin, {
  model: "keywordModel",
  field: "keywordId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("keywordModel", keywordSchema);
