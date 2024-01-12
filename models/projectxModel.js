const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const projectxSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: false,
    unique: true,
  },
  page_name: {
    type: String,
    required: true,
    unique:true
  },
  page_id: {
    type: Number,
    required: true,
  },
  page_user_id: {
    type: Number,
    required: true,
  },
  page_category_id: {
    type: Number,
    required: false,
    default: 0
  },
  projectx_user_id: {
    type: Number,
    required: true,
  },
  followers_count: {
    type: Number,
    required: true,
  },
  track: {
    type: Number,
    required: true,
  },
  manage_by: {
    type: Number,
    required: true,
  },
  page_link: {
    type: String,
    default: "",
  },
  profile_type: {
    type: String,
    default: "",
  },
  page_logo_url: {
    type: String,
    default: "",
  },
  tracking_cron: {
    type: String,
    default: "",
  },
  tracking: {
    type: Boolean,
    default: false,
  },
  crawler_count: {
    type: Number,
    default: 0,
  },
  max_post_count_a_day: {
    type: Number,
    default: 0,
  },
  avg_post_count_a_day: {
    type: Number,
    default: 0,
  },

  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

projectxSchema.pre('save', async function (next) {
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

module.exports = mongoose.model("projectxModel", projectxSchema);