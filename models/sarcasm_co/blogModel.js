const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const blogSchema = new mongoose.Schema(
  {
    blogCategoryId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    title: {
      type: String,
      required: false,
      default: "",
    },
    body: {
      type: String,
      required: false,
      default: "",
    },
    bannerImage: {
      type: String,
      required: false,
      default: "",
    },
    bannerAltDesc: {
      type: String,
      required: false,
      default: "",
    },
    metaTitle: {
      type: String,
      required: false,
      default: "",
    },
    metaDescription: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("blogModel", blogSchema);
