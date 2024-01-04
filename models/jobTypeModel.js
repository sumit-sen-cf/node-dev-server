const { default: mongoose } = require("mongoose");

const jobTypeSchema = new mongoose.Schema({
  job_type: {
    type: String,
    default: "",
  },
  job_type_description: {
    type: String,
    default: "",
  },
  created_by: {
    type: Number,
    default:0
  },
  created_at: {
    type: Date,
    default:Date.now()
  },
});

module.exports = mongoose.model("jobTypeModel", jobTypeSchema);
