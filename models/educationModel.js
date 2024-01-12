const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const educationModel = new mongoose.Schema({
  education_id: {
    type: Number,
    required: false,
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

educationModel.pre('save', async function (next) {
  if (!this.education_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'education_id': -1 } });

    if (lastAgency && lastAgency.education_id) {
      this.education_id = lastAgency.education_id + 1;
    } else {
      this.education_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model(
  "educationModel",
  educationModel
);
