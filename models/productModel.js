const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");
const productSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    required: true,
    unique: true,
  },
  Product_name: {
    type: String,
  },
  Product_type: {
    type: String,
  },
  Product_image: {
    type: String,
  },
  Duration: {
    type: String,
  },
  Stock_qty: {
    type: Number,
  },
  Unit: {
    type: String,
  },
  Opening_stock: {
    type: Number,
  },
  Opening_stock_date: {
    type: Date,
  },
  Remarks: {
    type: String,
  },
  creation_date: {
    type: Date,
    default: Date.now,
  },
  Created_by: {
    type: Number,
    default: 0,
  },
  Last_updated_by: {
    type: Number,
    default:0
  },

  Last_updated_date: {
    type: Date,
    default: Date.now,
  },

  props1: {
    type: String,
  },
  props2: {
    type: String,
  },
  props3: {
    type: String,
  },
  props1Int: {
    type: Number,
    default: 0,
  },
  props2Int: {
    type: Number,
    default: 0,
  },

  props3Int: {
    type: Number,
    default: 0,
  },
});

AutoIncrement.initialize(mongoose.connection);
productSchema.plugin(AutoIncrement.plugin, {
  model: "productModel",
  field: "product_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("productModel", productSchema);
