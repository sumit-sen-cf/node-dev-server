const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const announcementSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: false,
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

announcementSchema.pre('save', async function (next) {
  if (!this.id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });

    if (lastAgency && lastAgency.id) {
      this.id = lastAgency.id + 1;
    } else {
      this.id = 1;
    }
  }
  next();
});

module.exports = mongoose.model("announcementModel", announcementSchema);
