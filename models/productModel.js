const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    required: false,
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

productSchema.pre('save', async function (next) {
  if (!this.product_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'product_id': -1 } });

    if (lastAgency && lastAgency.product_id) {
      this.product_id = lastAgency.product_id + 1;
    } else {
      this.product_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("productModel", productSchema);
