const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const billingheaderModel = new mongoose.Schema({
  billingheader_id: {
    type: Number,
    required: true,
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

AutoIncrement.initialize(mongoose.connection);
billingheaderModel.plugin(AutoIncrement.plugin, {
  model: "billingheaderModels",
  field: "billingheader_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model(
  "billingheaderModel",
  billingheaderModel
);
