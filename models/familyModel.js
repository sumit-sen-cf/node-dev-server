const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const familyModel = new mongoose.Schema({
  family_id: {
    type: Number,
    required: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  DOB : {
    type: Date,
    default: ""
  },
  contact : {
    type: Number,
    required: false,
    default: 0
  },
  occupation : {
    type: String,
    required: false,
    default: ""
  },
  annual_income : {
    type: Number,
    required: false,
    default: 0
  },
  relation : {
    type: String,
    required: false,
    default: ""
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
familyModel.plugin(AutoIncrement.plugin, {
  model: "familyModels",
  field: "family_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model(
  "familyModel",
  familyModel
);
