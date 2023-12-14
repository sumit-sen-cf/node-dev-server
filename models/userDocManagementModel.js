const { default: mongoose } = require("mongoose");

const userDocSchema = new mongoose.Schema({
  reject_reason: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "",
  },
  timer: {
    type: String,
    default: "",
  },
  doc_id: {
    type: mongoose.Types.ObjectId,
    ref: "documentModel",
  },
  doc_image: {
    type: String,
    default: "",
  },
  user_id: {
    type: Number,
    default: 0,
  },
  upload_date: {
    type: Date,
    default: "",
  },
  approval_date: {
    type: Date,
    default: "",
  },
  approval_by: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("userDocManagmentModel", userDocSchema);
