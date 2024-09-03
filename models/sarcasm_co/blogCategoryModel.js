const mongoose = require("mongoose");
const blogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("blogCategoryModel", blogCategorySchema);
