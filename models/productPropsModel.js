const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");
const productPropsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
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

AutoIncrement.initialize(mongoose.connection);
productPropsSchema.plugin(AutoIncrement.plugin, {
  model: "productPropsModel",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("productPropsModel", productPropsSchema);
