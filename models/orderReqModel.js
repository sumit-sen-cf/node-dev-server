const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderReqSchema = new mongoose.Schema({
  Order_req_id: {
    type: Number,
    required: false,
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

orderReqSchema.pre('save', async function (next) {
  if (!this.Order_req_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'Order_req_id': -1 } });

    if (lastAgency && lastAgency.Order_req_id) {
      this.Order_req_id = lastAgency.Order_req_id + 1;
    } else {
      this.Order_req_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("OrderReqModel", orderReqSchema);