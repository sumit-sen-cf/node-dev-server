const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const billingheaderModel = new mongoose.Schema({
  billingheader_id: {
    type: Number,
    required: false,
  },
  billing_header_name: {
    type: String,
    required: true
  },
  dept_id: {
    type: Number,
    required: false,
  }
});

billingheaderModel.pre('save', async function (next) {
  if (!this.billingheader_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'billingheader_id': -1 } });

    if (lastAgency && lastAgency.billingheader_id) {
      this.billingheader_id = lastAgency.billingheader_id + 1;
    } else {
      this.billingheader_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model(
  "billingheaderModel",
  billingheaderModel
);
