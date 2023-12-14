const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const agencyModel = new mongoose.Schema({
  agency_id: {
    type: Number,
    required: true,
  },
  agency_name: {
    type: String,
    required: true,
    unique: true,
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
agencyModel.plugin(AutoIncrement.plugin, {
  model: "agencyModels",
  field: "agency_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model(
  "agencyModel",
  agencyModel
);
