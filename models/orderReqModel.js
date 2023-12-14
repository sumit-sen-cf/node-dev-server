const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");
const orderReqSchema = new mongoose.Schema({
  Order_req_id: {
    type: Number,
    required: true,
    unique: true,
  },
  product_id: {
    type: Number,
    default: 0,
  },
  Product_category: {
    type: String,
    default: "",
  },
  Order_quantity: {
    type: Number,
    required: true,
  },
  Special_request: {
    type: String,
    default: "",
  },
  User_id: {
    type: Number,
    default: 0,
  },
  Sitting_id: {
    type: Number,
  },
  Request_datetime: {
    type: Date,
  },
  Status: {
    type: String
  },
  Request_delivered_by: {
    type: Number,
    default:0
  },
  Delivered_datetime: {
    type: Date,
  },
  Message: {
    type: String,
    default: "",
  },
  Remarks: {
    type: String,
    default: "",
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
  Created_by: {
    type: Number,
    default:0
  },
  Last_updated_by: {
    type: Number,
  },
  Last_updated_date: {
    type: Date,
  },
  room_id: {
    type: Number,
    default: 0,
  },
  props1: {
    type: String,
    default: "",
  },
  props2: {
    type: String,
    default: "",
  },
  props3: {
    type: String,
    default: "",
  },
  props1Int: {
    type: Number,
  },
  props2Int: {
    type: Number,
  },
  props3Int: {
    type: Number,
  },
});

AutoIncrement.initialize(mongoose.connection);
orderReqSchema.plugin(AutoIncrement.plugin, {
  model: "OrderReqModel",
  field: "Order_req_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("OrderReqModel", orderReqSchema);
