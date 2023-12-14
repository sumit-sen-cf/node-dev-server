const { default: mongoose } = require("mongoose");

const pageUniquenessSchema = new mongoose.Schema({
  creator_name: {
    type: String,
    default: "",
  },
  user_id: {
    type: Number,
    unique: true,
    default: "",
    message: "User id must be unique",
  },
  status: {
    type: Number,
    default: "",
  },
});

module.exports = mongoose.model("pageUniquenessModel", pageUniquenessSchema);
