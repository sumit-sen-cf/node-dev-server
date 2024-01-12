const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const hobbyModel = new mongoose.Schema({
  hobby_id: {
    type: Number,
    required: false,
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

hobbyModel.pre('save', async function (next) {
  if (!this.hobby_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'hobby_id': -1 } });

    if (lastAgency && lastAgency.hobby_id) {
      this.hobby_id = lastAgency.hobby_id + 1;
    } else {
      this.hobby_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model(
  "hobbyModel",
  hobbyModel
);
