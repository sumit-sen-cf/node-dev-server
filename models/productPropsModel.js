const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const productPropsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: false,
    unique: true,
  },
  product_id: {
    type: Number,
    ref: "productModel",
    default: 0,
  },
  type_id: {
    type: Number,
    default: 0,
  },
  prop_category: {
    type: String,
  },
  prop_name: {
    type: String,
    default: "",
  },
  created_by: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  last_updated_by: {
    type: Number,
  },
  last_updated_at: {
    type: Date,
  },
});

productPropsSchema.pre('save', async function (next) {
  if (!this.id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });

    if (lastAgency && lastAgency.id) {
      this.id = lastAgency.id + 1;
    } else {
      this.id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("productPropsModel", productPropsSchema);