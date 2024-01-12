const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const contentSectionRegSchema = new mongoose.Schema({
  content_section_id: {
    type: Number,
    required: true,
    unique: true,
  },
  register_campaign_id: {
    type: Number,
    ref: "register_campaigns",
  },
  content_type_id: {
    type: Number,
  },
  content_brief: {
    type: String,
  },
  campaign_brief: {
    type: String,
  },
  campaign_dt: {
    type: String,
  },
  creator_dt: {
    type: String,
  },
  admin_remark: {
    type: String,
  },
  creator_remark: {
    type: String,
  },
  content_sec_file: {
    type: String,
  },
  est_static_vedio: {
    type: Number,
  },
  status: {
    type: Number,
  },
  stage: {
    type: Number,
  },
  assign_to: {
    type: Number,
  },
  cmpAdminDemoLink: {
    type: String,
  },
  cmpAdminDemoFile: {
    type: String,
  },
  endDate: {
    type: Date,
  },
});

contentSectionRegSchema.pre('save', async function (next) {
  if (!this.content_section_id) {
    const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'content_section_id': -1 } });

    if (lastAgency && lastAgency.content_section_id) {
      this.content_section_id = lastAgency.content_section_id + 1;
    } else {
      this.content_section_id = 1;
    }
  }
  next();
});

module.exports = mongoose.model(
  "contentSectionRegCmpModel",
  contentSectionRegSchema
);
