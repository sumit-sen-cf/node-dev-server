const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const commitmentSchema = new mongoose.Schema({
  cmtId: {
    type: Number,
    required: true,
    unique: true,
  },
  cmtName: {
    type: String,
    lowercase: true,
    trim: true,
  },
  cmtValue: {
    type: Number,
  },
});

AutoIncrement.initialize(mongoose.connection);
commitmentSchema.plugin(AutoIncrement.plugin, {
  model: "commitmentModel",
  field: "cmtId",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model(
  "commitmentModel",
  commitmentSchema
);
