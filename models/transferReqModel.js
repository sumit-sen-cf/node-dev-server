const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const transferReqSchema = new mongoose.Schema({
  Transfer_req_id: {
    type: Number,
    required: false,
    unique: true,
  },
  From_id: {
    type: Number,
    required: true,
    default: 0,
  },
  To_id: {
    type: Number,
    required: true,
    default: 0,
  },
  Reason: {
    type: String,
    required: true,
    default: "",
  },
  order_req_id: {
    type: Number,
    default: 0,
  },
});

transferReqSchema.pre('save', async function (next) {
  if (!this.Transfer_req_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'Transfer_req_id': -1 } });

    if (lastAgency && lastAgency.Transfer_req_id) {
      this.Transfer_req_id = lastAgency.Transfer_req_id + 1;
    } else {
      this.Transfer_req_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("transferRequestModel", transferReqSchema);
