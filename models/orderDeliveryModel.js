const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderDeliverySchema = new mongoose.Schema({
  Order_delivery_id: {
    type: Number,
    required: false,
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

orderDeliverySchema.pre('save', async function (next) {
  if (!this.Order_delivery_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'Order_delivery_id': -1 } });

    if (lastAgency && lastAgency.Order_delivery_id) {
      this.Order_delivery_id = lastAgency.Order_delivery_id + 1;
    } else {
      this.Order_delivery_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("OrderDeliveryModel", orderDeliverySchema);
