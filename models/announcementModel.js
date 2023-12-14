const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const announcementSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  dept_id: {
    type: Number,
  },
  desi_id: {
    type: Number,
  },
  heading: {
    type: String,
    default: "",
  },
  sub_heading: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  remark: {
    type: String,
    default: "",
  },

  onboard_status: {
    type: Number,
  },
  last_updated_by: {
    type: Number,
  },
  last_updated_at: {
    type: Date,
  },
  created_by: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

AutoIncrement.initialize(mongoose.connection);
announcementSchema.plugin(AutoIncrement.plugin, {
  model: "announcementModel",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model("announcementModel", announcementSchema);
