const mongoose = require("mongoose");
const instaImageUploadSchema = new mongoose.Schema({
  img: {
    type: String,
    required: false,
    default: "",
  },
  img_type: {
    type: Number,
    required: false,
    default: 0,   // 1 for brand images // 2 for campaign images 
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: "",
  },
  created_by: {
    type: Number,
    required: false,
    default: 0
  },
  updated_by: {
    type: Number,
    required: false,
    default: 0
  },
});


module.exports = mongoose.model("instaImageUploadModel", instaImageUploadSchema);
