const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const projectxPageSchema = new mongoose.Schema({
  category_id: {
    type: Number,
    required: true,
    unique: true,
  },
  category_name: {
    type: String,
    required: true,
  },
});

AutoIncrement.initialize(mongoose.connection);
projectxPageSchema.plugin(AutoIncrement.plugin, {
  model: "projectxPageCategoryModel",
  field: "category_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model(
  "projectxPageCategoryModel",
  projectxPageSchema
);
