const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const agencyModel = new mongoose.Schema({
  agency_id: {
    type: Number,
    required: false,
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

agencyModel.pre('save', async function (next) {
  if (!this.agency_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'agency_id': -1 } });

    if (lastAgency && lastAgency.agency_id) {
      this.agency_id = lastAgency.agency_id + 1;
    } else {
      this.agency_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("agencyModel",agencyModel)