const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const familyModel = new mongoose.Schema({
  family_id: {
    type: Number,
    required: false,
  },
  user_id: {
    type: Number,
    required: false,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  DOB: {
    type: Date,
    default: ""
  },
  contact: {
    type: Number,
    required: false,
    default: 0
  },
  occupation: {
    type: String,
    required: false,
    default: ""
  },
  annual_income: {
    type: Number,
    required: false,
    default: 0
  },
  relation: {
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

familyModel.pre('save', async function (next) {
  if (!this.family_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'family_id': -1 } });

    if (lastAgency && lastAgency.family_id) {
      this.family_id = lastAgency.family_id + 1;
    } else {
      this.family_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model(
  "familyModel",
  familyModel
);
