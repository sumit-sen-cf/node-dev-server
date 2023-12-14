const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");
const orderDeliverySchema = new mongoose.Schema({
  Order_delivery_id: {
    type: Number,
    required: true,
    unique: true,
  },
  Order_req_id: {
    type: Number,

    default: 0,
  },
  Product_name: {
    type: String,
    default: "",
  },
  Order_quantity: {
    type: Number,
  },
  Special_request: {
    type: String,
    default: "",
  },
  Sitting_name: {
    type: String,
    default: "",
  },
  Sitting_area: {
    type: String,
    default: "",
  },
  Request_datetime: {
    type: Date,
  },
  Status: {
    type: String,
  },
  Request_delivered_by: {
    type: Number,
  },
  Delivered_datetime: {
    type: Date,
  },
  Message: {
    type: String,
    default: "",
  },
});

AutoIncrement.initialize(mongoose.connection);
orderDeliverySchema.plugin(AutoIncrement.plugin, {
  model: "OrderDeliveryModel",
  field: "Order_delivery_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("OrderDeliveryModel", orderDeliverySchema);
