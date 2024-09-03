const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const blogImgesSchema = new mongoose.Schema(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    image: {
      type: String,
      required: false,
      default: "",
    },
    altDescription: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("blogImagesModel", blogImgesSchema);
