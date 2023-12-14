const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");
const transferReqSchema = new mongoose.Schema({
  Transfer_req_id: {
    type: Number,
    required: true,
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

AutoIncrement.initialize(mongoose.connection);
transferReqSchema.plugin(AutoIncrement.plugin, {
  model: "transferRequestModel",
  field: "Transfer_req_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("transferRequestModel", transferReqSchema);
