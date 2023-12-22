const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const hobbyModel = new mongoose.Schema({
  hobby_id: {
    type: Number,
    required: true,
  },
  hobby_name: {
    type: String,
    required: true,
    unique: true,
  },
  remark: {
    type: String,
    required: false,
    default : ""
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

AutoIncrement.initialize(mongoose.connection);
hobbyModel.plugin(AutoIncrement.plugin, {
  model: "hobbyModels",
  field: "hobby_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model(
  "hobbyModel",
  hobbyModel
);
