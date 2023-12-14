const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const projectxSubCategorySchema = new mongoose.Schema({
  sub_category_id: {
    type: Number,
    required: true,
    unique: true,
  },
  category_id: {
    type: Number,
    required: true,
  },
  sub_category_name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
});

AutoIncrement.initialize(mongoose.connection);
projectxSubCategorySchema.plugin(AutoIncrement.plugin, {
  model: "projectxSubcategoryModel",
  field: "sub_category_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model(
  "projectxSubcategoryModel",
  projectxSubCategorySchema
);
