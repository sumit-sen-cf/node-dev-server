const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

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

commitmentSchema.pre('save', async function (next) {
  if (!this.cmtId) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'cmtId': -1 } });

    if (lastAgency && lastAgency.cmtId) {
      this.cmtId = lastAgency.cmtId + 1;
    } else {
      this.cmtId = 1;
    }
  }
  next();
});

module.exports = mongoose.model(
  "commitmentModel",
  commitmentSchema
);
