const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const educationModel = new mongoose.Schema({
  education_id: {
    type: Number,
    required: true,
  },
  user_id: {
    type: Number,
    required: false,
  },
  institute_name: {
    type: String,
    required: true,
    unique: true,
  },
  from_year: {
    type: Date,
    default: ""
  },
  to_year: {
    type: Date,
    default: ""
  },
  percentage: {
    type: Number,
    required: false,
    default: 0
  },
  stream: {
    type: String,
    required: false,
    default: ""
  },
  specialization: {
    type: String,
    required: false,
    default: ""
  },
  title: {
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
educationModel.plugin(AutoIncrement.plugin, {
  model: "educationModels",
  field: "education_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model(
  "educationModel",
  educationModel
);
